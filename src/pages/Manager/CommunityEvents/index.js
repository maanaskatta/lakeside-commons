import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { MdAddCircleOutline } from "react-icons/md";
import { BsPencil } from "react-icons/bs";
import AddEditCommunityEvents from "./AddEditCommunityEvents";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";

const CommunityEvents = ({ label }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eventToBeEdited, setEventToBeEdited] = useState(null);
  const [events, setEvents] = useState(null);

  const editEvent = (resident) => {
    setEventToBeEdited(resident);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    getData("getCommunityEvents")
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isModalOpen]);

  const data = React.useMemo(
    () =>
      events
        ? events.map((event) => {
            return {
              ...event,
              edit: (
                <button
                  onClick={() => editEvent(event)}
                  className="flex justify-center items-center w-full cursor-pointer"
                >
                  <BsPencil />
                </button>
              ),
            };
          })
        : [],
    [events]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Event Name",
        accessor: "eventName",
      },
      {
        Header: "Date and Time",
        accessor: "dateAndTime",
      },
      {
        Header: "Event Description",
        accessor: "description",
      },
      {
        Header: "Venue",
        accessor: "venue",
      },

      {
        Header: "Edit",
        accessor: "edit",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  console.log(data);
  return (
    <div className="flex p-8 flex-col gap-10 w-full">
      <div className="flex w-full items-center justify-between">
        <p className="text-2xl font-semibold">{label}</p>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 px-3 py-2 bg-blue-900 text-white text-base rounded"
        >
          <MdAddCircleOutline />
          <p>Add new event</p>
        </button>
      </div>
      {isLoading ? (
        <Loading />
      ) : events && events.length > 0 ? (
        <table {...getTableProps()} style={{ border: "solid 1px blue" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{
                      borderBottom: "solid 3px red",
                      background: "aliceblue",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        style={{
                          padding: "10px",
                          border: "solid 1px gray",
                          backgroundColor: "whitesmoke",
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <NoDataText message={"No events found!..."} />
      )}

      {isModalOpen ? (
        <AddEditCommunityEvents
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          event={eventToBeEdited}
          setEventToBeEdited={setEventToBeEdited}
        />
      ) : null}
    </div>
  );
};

export default CommunityEvents;
