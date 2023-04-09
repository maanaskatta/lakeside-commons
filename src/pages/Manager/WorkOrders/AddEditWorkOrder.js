import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import CustomStyledSelect from "../../../components/CustomStyledSelect";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import insertData from "../RouteControllers/insertData";
import updateData from "../RouteControllers/updateData";

const customStyles = {
  content: {
    maxHeight: "80%",
  },
};

export default function AddEditworkOrder({
  isModalOpen,
  setIsModalOpen,
  workOrder,
}) {
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const workOrderFieldKeys = [
    {
      name: "unitNumber",
      placeholder: "Enter the unit number...",
      label: "Unit Number",
    },
    {
      name: "issueDescription",
      placeholder: "Enter the issue description...",
      label: "Issue Description",
    },
  ];

  const addNewWorkOrder = async (data) => {
    let res = await insertData("addWorkOrder", data);
    if (res) {
      toast.success("Work order added successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to add new work order!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const updateWorkOrder = async (data) => {
    let res = await updateData("updateWorkOrder", data);
    if (res) {
      toast.success("Work order updated successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to update work order!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const schema = Yup.object().shape(
    workOrderFieldKeys.reduce((prev, cur) => {
      return {
        ...prev,
        [cur.name]: Yup.string().nullable().required("Required"),
      };
    }, {})
  );

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
              Add {workOrder ? "Edit" : "New"} Work Order
            </div>
            <button onClick={() => setIsModalOpen(false)}>
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </header>

          <div className="p-3 flex flex-col gap-3">
            <Formik
              initialValues={workOrderFieldKeys.reduce((prev, cur) => {
                return {
                  ...prev,
                  [cur.name]:
                    workOrder && workOrder[cur.name] ? workOrder[cur.name] : "",
                };
              }, {})}
              validationSchema={schema}
              onSubmit={(values, r) => {
                console.log(values);
                setMutationInProgress(true);
                if (workOrder) {
                  updateWorkOrder({
                    WorkOrderID: workOrder.WorkOrderID,
                    ...values,
                  });
                } else {
                  addNewWorkOrder(values);
                  r.resetForm();
                }
              }}
            >
              {({ values }) => {
                return (
                  <Form className="flex flex-col p-8 gap-5">
                    {workOrderFieldKeys.map((workOrder, index) => {
                      if (workOrder.type !== "select") {
                        return (
                          <div>
                            <p>
                              {workOrder.label}
                              <span className="text-red-600">*</span>
                            </p>
                            <Field
                              name={workOrder.name}
                              placeholder={workOrder.placeholder}
                              className="bg-gray-100 px-3 py-2 rounded-lg w-full placeholder-black-444"
                            />
                            <ErrorMessage
                              name={workOrder.name}
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
                              {workOrder.label}
                              <span className="text-red-600">*</span>
                            </p>
                            <Field
                              name={workOrder.name}
                              options={workOrder.options}
                              component={(props) => (
                                <CustomStyledSelect
                                  {...props}
                                  isClearable
                                  isSearchable
                                />
                              )}
                            />
                            <ErrorMessage
                              name={workOrder.name}
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
