import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomStyledSelect from "../../../components/CustomStyledSelect";
import insertData from "../RouteControllers/insertData";
import updateData from "../RouteControllers/updateData";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";

const customStyles = {
  content: {
    maxHeight: "80%",
  },
};

export default function AddEditfineLots({
  isModalOpen,
  setIsModalOpen,
  fine,
  setFineToBeEdited,
}) {
  const [mutationInProgress, setMutationInProgress] = useState(false);
  const [units, setUnits] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fineFieldKeys = [
    {
      name: "unitNumber",
      placeholder: "Enter the unit number...",
      label: "Unit Number",
      type: "select",
      options: units,
    },
    {
      name: "description",
      placeholder: "Enter the issue description...",
      label: "Issue Description",
    },
    {
      name: "amount",
      placeholder: "Enter the amount...",
      label: "Amount",
    },
  ];

  useEffect(() => {
    (async () => {
      let res = await getData("getHomes");
      if (res) {
        setUnits(
          res.map((unit) => {
            return {
              label: unit.unitNumber,
              value: unit.unitNumber,
            };
          })
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("Failed to fetch units!...");
      }
    })();
  }, []);

  const addNewFine = async (data) => {
    let res = await insertData("addFine", data);
    if (res) {
      toast.success("Fine added successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to add new fine!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const updateFine = async (data) => {
    let res = await updateData("updateFine", data);
    if (res) {
      toast.success("Fine updated successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to update fine!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const schema = Yup.object().shape(
    fineFieldKeys.reduce((prev, cur) => {
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
            <div className="text-white">Add {fine ? "Edit" : "New"} Fine</div>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setFineToBeEdited(null);
              }}
            >
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </header>

          <div className="p-3 flex flex-col gap-3">
            {isLoading ? (
              <Loading />
            ) : (
              <Formik
                initialValues={fineFieldKeys.reduce((prev, cur) => {
                  return {
                    ...prev,
                    [cur.name]: fine && fine[cur.name] ? fine[cur.name] : "",
                  };
                }, {})}
                validationSchema={schema}
                onSubmit={(values, r) => {
                  console.log(values);
                  setMutationInProgress(true);
                  if (fine) {
                    updateFine({
                      FineID: fine.FineID,
                      ...values,
                    });
                  } else {
                    addNewFine(values);
                    r.resetForm();
                  }
                }}
              >
                {({ values }) => {
                  return (
                    <Form className="flex flex-col p-8 gap-5">
                      {fineFieldKeys.map((technician, index) => {
                        if (technician.type !== "select") {
                          return (
                            <div>
                              <p>
                                {technician.label}
                                <span className="text-red-600">*</span>
                              </p>
                              <Field
                                name={technician.name}
                                placeholder={technician.placeholder}
                                className="bg-gray-100 px-3 py-2 rounded-lg w-full placeholder-black-444"
                              />
                              <ErrorMessage
                                name={technician.name}
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
                                {technician.label}
                                <span className="text-red-600">*</span>
                              </p>
                              <Field
                                name={technician.name}
                                options={technician.options}
                                component={(props) => (
                                  <CustomStyledSelect
                                    {...props}
                                    isClearable
                                    isSearchable
                                  />
                                )}
                              />
                              <ErrorMessage
                                name={technician.name}
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
                          onClick={() => {
                            setIsModalOpen(false);
                            setFineToBeEdited(null);
                          }}
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
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
