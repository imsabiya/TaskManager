import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TaskCard from "./TaskCard";

const Home = () => {
  const [userTaskData, setUserTaskData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);

  const userId = sessionStorage.getItem("userId");

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    initialValues: {
      title: "",
    },
  });

  const getTaskDataByUserId = async () => {
    if (userId) {
      const paramsData = { id: userId };

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_TASK_MANAGER_URL}/user`,
          { params: paramsData }
        );
        const data = res.data;
        setUserTaskData(data);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    getTaskDataByUserId();
    console.log(refreshData, "refreshData");
  }, [refreshData]);

  const submitHandler = async (data) => {
    const newTaskDataRequest = {
      ...data,
      createdBy: userId,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_TASK_MANAGER_URL}/addTask`,
        newTaskDataRequest
      );
      const data = res.data;
      toast.success(data.message);
      getTaskDataByUserId();
      setRefreshData(!refreshData);
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex flex-row-reverse justify-between place-items-center mt-4 gap-2 mx-auto">
        <div className="flex gap-2 mx-2 place-items-center">
          <form className="flex" onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Enter Task..."
                className="input input-bordered"
                {...register("title", {
                  required: "Task title is required",
                  pattern: {
                    value: /^[A-Za-z]+[A-Za-z0-9 -]*/i,
                    message: "Invalid Task Title",
                  },
                })}
                required
              />
              {errors.title && (
                <span className="text-red-400 text-left text-sm ml-1 my-1">
                  {errors?.title?.message}
                </span>
              )}
            </div>
            <div className="flex ">
              <input
                type="submit"
                className="btn btn-neutral tracking-wider ml-2"
                value="Add Task"
              />
            </div>
          </form>
        </div>
        <div className="mx-2">
          <input
            type="text"
            placeholder="Search Task..."
            className="input input-bordered"
            // value={searchText}
            // onChange={(e) => handleUserSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-x-4 gap-y-4 my-4 mt-8 place-items-center">
        {/* tasks here */}
        {userTaskData && userTaskData.tasks?.length > 0 ? (
          userTaskData.tasks.map((task) => {
            return (
              <TaskCard
                task={task}
                setRefreshData={setRefreshData}
                refreshData={refreshData}
              />
            );
          })
        ) : (
          <div className="w-full flex justify-center">
            No Tasks right now.{" "}
            <span className="font-semibold pl-2 inline-block mb-1 border-b-2 border-black">
              Add a Task to get started.
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
