import React, { useEffect, useState } from "react";
import { MdAddCircleOutline, MdDateRange } from "react-icons/md";
import { BiBookContent } from "react-icons/bi";
import { BsPencil, BsTrash, BsCardHeading } from "react-icons/bs";
import AddEditAnnouncements from "./AddEditAnnouncements";
import getData from "../RouteControllers/getData";
import Loading from "../../../components/Loading";
import NoDataText from "../../../components/NoDataText";
import deleteData from "../RouteControllers/deleteData";
import { toast } from "react-toastify";

const Announcement = ({
  announcement,
  announcements,
  setAnnouncements,
  setIsUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mutationInProgress, setMutationInProgress] = useState(false);

  const deleteGate = async (data) => {
    setMutationInProgress(true);
    let res = await deleteData("deleteAnnouncement", data);
    if (res) {
      toast.success("Announcement deleted successfully...");
      setAnnouncements(
        announcements.filter(
          (item) => item.AnnouncementID !== announcement.AnnouncementID
        )
      );
      setMutationInProgress(false);
    } else {
      toast.error("Failed to delete announcement!...");
      setMutationInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 border bg-blue-100 rounded shadow-md">
      <div className="flex items-center gap-1">
        <BsCardHeading className="text-xl" />
        <p className="font-semibold text-2xl">{announcement.title}</p>
      </div>

      <div className="flex items-center gap-1">
        <BiBookContent className="text-xl" />
        <p className="text-base">{announcement.description}</p>
      </div>

      <div className="flex items-center gap-1">
        <MdDateRange className="text-xl" />
        <p className="text-sm">{announcement.dateAndTime}</p>
      </div>

      <div className="flex justify-end items-center gap-5">
        <BsPencil
          onClick={() => {
            setIsModalOpen(true);
          }}
          className=" text-blue-900 text-xl cursor-pointer"
        />
        <BsTrash
          onClick={() => {
            deleteGate({
              AnnouncementID: announcement.AnnouncementID,
            });
          }}
          className={`text-red-600 text-xl cursor-pointer ${
            mutationInProgress ? " animate-spin" : ""
          }`}
        />
      </div>

      {isModalOpen ? (
        <AddEditAnnouncements
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          announcement={announcement}
          setIsUpdated={setIsUpdated}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default function Announcements({ label }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [announcements, setAnnouncements] = useState(null);
  const [isUpdated, setIsUpdated] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    getData("getAnnouncements")
      .then((data) => {
        setAnnouncements(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isModalOpen, isUpdated]);

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
          <p>Add new announcement</p>
        </button>
      </div>

      {isLoading ? (
        <Loading />
      ) : announcements && announcements.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {announcements.map((announcement) => (
            <Announcement
              announcement={announcement}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              setIsUpdated={setIsUpdated}
            />
          ))}
        </div>
      ) : (
        <NoDataText message={"No announcements found!..."} />
      )}

      {isModalOpen ? (
        <AddEditAnnouncements
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          announcement={null}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
