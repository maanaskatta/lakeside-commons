import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";
import getData from "../RouteControllers/getData";

const RentHistory = ({ label }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rentHistory, setRentHistory] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getData("getRentHistories")
      .then((data) => {
        setRentHistory(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const data = React.useMemo(
    () => (rentHistory ? rentHistory : []),
    [rentHistory]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Unit Number",
        accessor: "unitNumber",
      },
      {
        Header: "Amount",
        accessor: "Amount",
      },
      {
        Header: "Date and Time",
        accessor: "dateAndTime",
      },

      {
        Header: "Payment Method",
        accessor: "paymentMethod",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="flex p-8 flex-col gap-10 w-full">
      <div className="flex w-full items-center justify-between">
        <p className="text-2xl font-semibold">{label}</p>
      </div>
      {isLoading ? (
        <Loading />
      ) : rentHistory && rentHistory.length > 0 ? (
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
        <NoDataText message={"No rents history found...."} />
      )}
    </div>
  );
};

export default RentHistory;
