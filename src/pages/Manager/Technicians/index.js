import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { MdAddCircleOutline } from "react-icons/md";
import { BsPencil } from "react-icons/bs";
import AddEditTechnician from "./AddEditTechnician";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";

const Technicians = ({ label }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [technicians, setTechnicians] = useState(null);

  const [technicianToBeEdited, setResidentToBeEdited] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getData("getTechnicians")
      .then((data) => {
        setTechnicians(data);
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
      technicians
        ? technicians.map((technician) => {
            return {
              ...technician,
              edit: (
                <button
                  onClick={() => editResident(technician)}
                  className="flex justify-center items-center w-full cursor-pointer"
                >
                  <BsPencil />
                </button>
              ),
            };
          })
        : [],
    [technicians]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Department",
        accessor: "departmentName",
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
      },
      {
        Header: "",
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
          <p>Add new technician</p>
        </button>
      </div>
      {isLoading ? (
        <Loading />
      ) : technicians && technicians.length > 0 ? (
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
        <NoDataText message={"No technicians found!..."} />
      )}

      {isModalOpen ? (
        <AddEditTechnician
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          technician={technicianToBeEdited}
        />
      ) : null}
    </div>
  );
};

export default Technicians;
