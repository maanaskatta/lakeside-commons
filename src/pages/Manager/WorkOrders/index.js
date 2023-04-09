import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { MdAddCircleOutline } from "react-icons/md";
import { BsPencil } from "react-icons/bs";
import AddEditworkOrder from "./AddEditWorkOrder";
import getData from "../RouteControllers/getData";
import NoDataText from "../../../components/NoDataText";
import Loading from "../../../components/Loading";

const WorkOrders = ({ label }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState(null);
  const [workOrderToBeEdited, setWorkOrderToBeEdited] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getData("getWorkOrders")
      .then((data) => {
        setWorkOrders(data);
        setIsLoading(false);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isModalOpen]);

  const editWorkOrder = (workOrder) => {
    setWorkOrderToBeEdited(workOrder);
    setIsModalOpen(true);
  };

  const data = React.useMemo(
    () =>
      workOrders
        ? workOrders.map((order) => {
            return {
              ...order,
              edit: (
                <button
                  onClick={() => editWorkOrder(order)}
                  className="flex justify-center items-center w-full cursor-pointer"
                >
                  <BsPencil />
                </button>
              ),
            };
          })
        : [],
    [workOrders]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Unit Number",
        accessor: "unitNumber",
      },
      {
        Header: "Date and Time",
        accessor: "dateAndTime",
      },
      {
        Header: "Description",
        accessor: "issueDescription",
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
          <p>Add new work order</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : workOrders && workOrders.length > 0 ? (
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
        <NoDataText message={"No work orders found!..."} />
      )}

      {isModalOpen ? (
        <AddEditworkOrder
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          workOrder={workOrderToBeEdited}
        />
      ) : null}
    </div>
  );
};

export default WorkOrders;
