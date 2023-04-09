import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import insertData from "../../Manager/RouteControllers/insertData";
import updateData from "../../Manager/RouteControllers/updateData";

const schema = Yup.object().shape({
  CategoryName: Yup.string().nullable().required("Required"),
});

const customStyles = {
  content: {
    maxHeight: "80%",
  },
};

export default function AddEditPhotoCategory({
  isModalOpen,
  setIsModalOpen,
  category,
  setIsUpdated,
}) {
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const addNewCategory = async (data) => {
    let res = await insertData("addPhotoCategory", data);
    if (res) {
      toast.success("Parking lot added successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to add new parking lot!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const updateCategory = async (data) => {
    let res = await updateData("updatePhotoCategory", data);
    if (res) {
      toast.success("Parking lot updated successfully...");
      setIsUpdated(Math.random());
      setMutationInProgress(false);
    } else {
      toast.error("Failed to update parking lot!...");
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
              Add {category ? "Edit" : "New"} Category
            </div>
            <button onClick={() => setIsModalOpen(false)}>
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </header>

          <div className="p-3 flex flex-col gap-3">
            {/* <Temp /> */}
            <Formik
              initialValues={{
                CategoryName: category ? category.CategoryName : "",
              }}
              validationSchema={schema}
              onSubmit={(values, r) => {
                console.log(values);
                setMutationInProgress(true);
                if (category) {
                  updateCategory({
                    categoryID: category.categoryID,
                    ...values,
                  });
                } else {
                  addNewCategory(values);
                  r.resetForm();
                }
              }}
            >
              {({ values }) => {
                return (
                  <Form className="flex flex-col p-8 gap-5">
                    <div>
                      <p>
                        Category Name <span className="text-red-600">*</span>
                      </p>
                      <Field
                        name="CategoryName"
                        placeholder="Enter the category name..."
                        className="bg-gray-100 px-3 py-2 rounded-lg w-full placeholder-black-444"
                      />
                      <ErrorMessage
                        name="CategoryName"
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
