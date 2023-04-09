import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import CustomStyledSelect from "../../../components/CustomStyledSelect";
import getData from "../RouteControllers/getData";
import insertData from "../RouteControllers/insertData";
import updateData from "../RouteControllers/updateData";

const customStyles = {
  content: {
    maxHeight: "80%",
  },
};

export default function AddEditParkingLots({
  isModalOpen,
  setIsModalOpen,
  parking,
  setIsUpdated,
}) {
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [residents, setResidents] = useState(null);

  const parkingFieldKeys = [
    {
      name: "parkingClass",
      placeholder: "Enter the class...",
      type: "select",
      label: "Parking Class",
      options: [
        {
          label: "Regular",
          value: "Regular",
        },
        {
          label: "VIP",
          value: "VIP",
        },
        {
          label: "Handicapped",
          value: "Handicapped",
        },
      ],
    },
    {
      name: "parkingTagNumber",
      placeholder: "Enter the parking tag number...",
      type: "text",
      label: "Parking Tag Number",
    },
    {
      name: "ResidentID",
      placeholder: "Select the resident...",
      type: "select",
      label: "Resident",
      options: residents
        ? residents.map((resident) => {
            return {
              label: resident.firstName + " " + resident.lastName,
              value: resident.ResidentID,
            };
          })
        : [],
    },
  ];

  const schema = Yup.object().shape(
    parkingFieldKeys.reduce((prev, cur) => {
      return {
        ...prev,
        [cur.name]: Yup.string().nullable().required("Required"),
      };
    }, {})
  );

  useEffect(() => {
    setIsLoading(true);
    getData("getResidents")
      .then((data) => {
        setResidents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isModalOpen]);

  const addNewParkingLot = async (data) => {
    let res = await insertData("addParking", data);
    if (res) {
      toast.success("Parking lot added successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to add new parking lot!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const updateParkingLot = async (data) => {
    let res = await updateData("updateParking", data);
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
              Add {parking ? "Edit" : "New"} Parking
            </div>
            <button onClick={() => setIsModalOpen(false)}>
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </header>

          <div className="p-3 flex flex-col gap-3">
            <Formik
              initialValues={parkingFieldKeys.reduce((prev, cur) => {
                return {
                  ...prev,
                  [cur.name]:
                    parking && parking[cur.name] ? parking[cur.name] : "",
                };
              }, {})}
              validationSchema={schema}
              onSubmit={(values, r) => {
                console.log(values);
                setMutationInProgress(true);
                if (parking) {
                  updateParkingLot({
                    ParkingLotID: parking.ParkingLotID,
                    ...values,
                  });
                } else {
                  addNewParkingLot(values);
                  r.resetForm();
                }
              }}
            >
              {({ values }) => {
                return (
                  <Form className="flex flex-col p-8 gap-5">
                    {parkingFieldKeys.map((parking, index) => {
                      if (parking.type !== "select") {
                        return (
                          <div>
                            <p>
                              {parking.label}
                              <span className="text-red-600">*</span>
                            </p>
                            <Field
                              name={parking.name}
                              placeholder={parking.placeholder}
                              className="bg-gray-100 px-3 py-2 rounded-lg w-full placeholder-black-444"
                            />
                            <ErrorMessage
                              name={parking.name}
                              render={(msg) => (
                                <div className="text-red-600 text-sm">
                                  {msg}
                                </div>
                              )}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div>
                            <p>
                              {parking.label}
                              <span className="text-red-600">*</span>
                            </p>
                            {isLoading ? (
                              <p>Loading...</p>
                            ) : (
                              <Field
                                name={parking.name}
                                options={parking.options}
                                component={(props) => (
                                  <CustomStyledSelect
                                    {...props}
                                    isClearable
                                    isSearchable
                                  />
                                )}
                              />
                            )}
                            <ErrorMessage
                              name={parking.name}
                              render={(msg) => (
                                <div className="text-red-600 text-sm">
                                  {msg}
                                </div>
                              )}
                            />
                          </div>
                        );
                      }
                    })}

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
