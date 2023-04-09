import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import { MdAddCircleOutline } from "react-icons/md";
import { BsPencil } from "react-icons/bs";
import AddEditResidents from "./AddEditResidents";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";

const Residents = ({ label }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [residentToBeEdited, setResidentToBeEdited] = useState(null);
  const [residents, setResidents] = useState(null);

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

  const editResident = (resident) => {
    setResidentToBeEdited(resident);
    setIsModalOpen(true);
  };

  const data = React.useMemo(
    () =>
      residents && residents.length > 0
        ? residents.map((resident) => {
            return {
              ...resident,
              edit: (
                <button
                  onClick={() => editResident(resident)}
                  className="flex justify-center items-center w-full cursor-pointer"
                >
                  <BsPencil />
                </button>
              ),
            };
          })
        : [],
    [residents]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName", // accessor is the "key" in the data
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Unit Number",
        accessor: "unitNumber",
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
      },
      {
        Header: "EmailID",
        accessor: "emailID",
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
          <p>Add new resident</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : residents && residents.length > 0 ? (
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
        <p className="flex justify-center text-xl">No residents found!..</p>
      )}

      {isModalOpen ? (
        <AddEditResidents
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          resident={residentToBeEdited ? residentToBeEdited : null}
          setResidentToBeEdited={setResidentToBeEdited}
        />
      ) : null}
    </div>
  );
};

export default Residents;
