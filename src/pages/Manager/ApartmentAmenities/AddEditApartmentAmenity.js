import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import insertData from "../RouteControllers/insertData";
import updateData from "../RouteControllers/updateData";
import getData from "../RouteControllers/getData";

const schema = Yup.object().shape({
  AmenityName: Yup.string().nullable().required("Required"),
});

const customStyles = {
  content: {
    maxHeight: "80%",
  },
};

export default function AddEditApartmentAmenity({
  isModalOpen,
  setIsModalOpen,
  amenity,
  setIsUpdated,
}) {
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const addNewAmenity = async (data) => {
    let res = await insertData("addApartmentAmenity", data);
    if (res) {
      toast.success("Amenity added successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to add new amenity!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const updateAmenity = async (data) => {
    let res = await updateData("updateApartmentAmenity", data);
    if (res) {
      toast.success("Amenity updated successfully...");
      setIsUpdated(Math.random());
      setMutationInProgress(false);
    } else {
      toast.error("Failed to update amenity!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
        }}
        htmlOpenClassName="overflow-hidden"
        style={customStyles}
        bodyOpenClassName="overflow-hidden"
        className="inset-y-auto inset-x-auto bg-white rounded-md w-1/2 absolute top-0 mt-10 focus:outline-none overflow-auto"
        overlayClassName="transition-all ease-in-out duration-300 flex justify-center items-center bg-opacity-75 bg-black inset-0 fixed p-8"
      >
        <div>
          <header className="rounded-t-md bg-blue-700 w-full py-5 px-12 text-white flex items-center justify-between">
            <div className="text-white">
              Add {amenity ? "Edit" : "New"} Amenity
            </div>
            <button onClick={() => setIsModalOpen(false)}>
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </header>

          <div className="p-3 flex flex-col gap-3">
            {/* <Temp /> */}
            <Formik
              initialValues={{
                AmenityName: amenity ? amenity.AmenityName : "",
              }}
              validationSchema={schema}
              onSubmit={(values, r) => {
                console.log(values);
                setMutationInProgress(true);
                if (amenity) {
                  updateAmenity({
                    AprtAmenityID: amenity.AprtAmenityID,
                    ...values,
                  });
                } else {
                  addNewAmenity(values);
                  r.resetForm();
                }
              }}
            >
              {({ values }) => {
                return (
                  <Form className="flex flex-col p-8 gap-5">
                    <div>
                      <p>
                        Amenity Name <span className="text-red-600">*</span>
                      </p>
                      <Field
                        name="AmenityName"
                        placeholder="Enter the amenity name..."
                        className="bg-gray-100 px-3 py-2 rounded-lg w-full placeholder-black-444"
                      />
                      <ErrorMessage
                        name="AmenityName"
                        render={(msg) => (
                          <div className="text-red-600 text-sm">{msg}</div>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-5 my-5">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        type="reset"
                        className="px-3 py-2 bg-red-600 text-white rounded-lg focus:outline-none"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg focus:outline-none"
                      >
                        {mutationInProgress ? (
                          <div className="flex gap-3">
                            <div className="spinner-grow w-6 h-6 mr-3"></div>
                            <div>{"Please wait..."}</div>
                          </div>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Modal>
    </div>
  );
}
