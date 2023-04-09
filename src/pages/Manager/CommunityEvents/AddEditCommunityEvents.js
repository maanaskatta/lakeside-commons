import React, { useState } from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomStyledSelect from "../../../components/CustomStyledSelect";
import insertData from "../RouteControllers/insertData";
import updateData from "../RouteControllers/updateData";

const customStyles = {
  content: {
    maxHeight: "80%",
  },
};

export default function AddEditCommunityEvents({
  isModalOpen,
  setIsModalOpen,
  event,
  setEventToBeEdited,
}) {
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const eventFieldKeys = [
    {
      name: "eventName",
      placeholder: "Enter the event name...",
      label: "Event Name",
    },
    {
      name: "description",
      placeholder: "Enter the event description...",
      label: "Event Description",
    },
    {
      name: "dateAndTime",
      placeholder: "Enter the date and time...",
      label: "Date and Time",
    },
    {
      name: "venue",
      placeholder: "Enter the venue...",
      label: "Venue",
    },
  ];

  const addNewEvent = async (data) => {
    let res = await insertData("addCommunityEvent", data);
    if (res) {
      toast.success("Event added successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to add new event!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const updateEvent = async (data) => {
    let res = await updateData("updateCommunityEvent", data);
    if (res) {
      toast.success("Event updated successfully...");
      setMutationInProgress(false);
    } else {
      toast.error("Failed to update event!...");
      setMutationInProgress(false);
    }
    console.log(res);
  };

  const schema = Yup.object().shape(
    eventFieldKeys.reduce((prev, cur) => {
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
            <div className="text-white">Add {event ? "Edit" : "New"} Event</div>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEventToBeEdited(null);
              }}
            >
              <MdClose className="w-6 h-6 text-white" />
            </button>
          </header>

          <div className="p-3 flex flex-col gap-3">
            <Formik
              initialValues={eventFieldKeys.reduce((prev, cur) => {
                return {
                  ...prev,
                  [cur.name]: event && event[cur.name] ? event[cur.name] : "",
                };
              }, {})}
              validationSchema={schema}
              onSubmit={(values, r) => {
                console.log(values);
                setMutationInProgress(true);
                if (event) {
                  updateEvent({
                    EventID: event.EventID,
                    ...values,
                  });
                } else {
                  addNewEvent(values);
                  r.resetForm();
                }
              }}
            >
              {({ values }) => {
                return (
                  <Form className="flex flex-col p-8 gap-5">
                    {eventFieldKeys.map((event, index) => {
                      if (event.type !== "select") {
                        return (
                          <div>
                            <p>
                              {event.label}
                              <span className="text-red-600">*</span>
                            </p>
                            <Field
                              name={event.name}
                              placeholder={event.placeholder}
                              className="bg-gray-100 px-3 py-2 rounded-lg w-full placeholder-black-444"
                            />
                            <ErrorMessage
                              name={event.name}
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
                              {event.label}
                              <span className="text-red-600">*</span>
                            </p>
                            <Field
                              name={event.name}
                              options={event.options}
                              component={(props) => (
                                <CustomStyledSelect
                                  {...props}
                                  isClearable
                                  isSearchable
                                />
                              )}
                            />
                            <ErrorMessage
                              name={event.name}
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
                          setEventToBeEdited(null);
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
          </div>
        </div>
      </Modal>
    </div>
  );
}
