import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskCard = ({ task, setRefreshData, refreshData }) => {
  const navigate = useNavigate();

  const [showEditInput, setShowEditInput] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: task.title });

  const deleteTask = async (task) => {
    console.log(task, "delete");
    const deleteParams = {
      id: task._id,
    };

    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_TASK_MANAGER_URL}/task`,
        { params: deleteParams }
      );
      const data = res.data;
      setRefreshData(!refreshData);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  const editTask = async (task) => {
    console.log(task, "edit");
    setShowEditInput(false);
    const newParams = {
      id: task._id,
    };
    const reqData = {
      ...task,
      title: editedTask.title,
    };
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_TASK_MANAGER_URL}/task`,
        reqData,
        { params: newParams }
      );
      const data = res.data;
      setRefreshData(!refreshData);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  const handleTaskComplete = async (e, task) => {
    const newParams = {
      id: task._id,
    };
    const reqData = {
      isCompleted: !task.isCompleted,
    };
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_TASK_MANAGER_URL}/task`,
        reqData,
        { params: newParams }
      );
      const data = res.data;
      setRefreshData(!refreshData);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <>
      <div
        className="mx-4 hover:cursor-pointer w-full flex justify-center"
        key={task.id}
      >
        <div className="flex px-2 w-4/6 gap-2 bg-slate-400 shadow-xl rounded-md">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={(e) => handleTaskComplete(e, task)}
          />
          <div className="flex p-2 text-white w-full">
            <div className="flex w-full justify-between place-items-center">
              {!showEditInput ? (
                <h2
                  className="text-xl font-semibold capitalize"
                  style={
                    task.isCompleted
                      ? { textDecoration: "line-through" }
                      : { textDecoration: "none" }
                  }
                >
                  {task.title}
                </h2>
              ) : (
                <div className="w-full flex justify-start place-items-center relative">
                  <input
                    type="text"
                    value={editedTask.title}
                    className="input p-0 m-0 w-1/2 text-neutral"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setEditedTask({ title: e.target.value });
                    }}
                  />
                  {/* <span
                    className="absolute inset-x-0 right-12 text-red-600 font-bold hover:cursor-pointer"
                    onClick={() => {
                      setShowEditInput(false);
                    }}
                  > */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    onClick={() => editTask(task)}
                    className="flex w-6 h-6 absolute inset-x-64 right-0 text-green-600 font-bold hover:cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    onClick={() => setShowEditInput(false)}
                    className="flex w-6 h-6 absolute inset-x-72 right-0 text-red-600 font-bold hover:cursor-pointer"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                  {/* </span> */}
                </div>
              )}
              <div className="flex justify-center place-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-green-900 hover:cursor-pointer"
                  onClick={() => setShowEditInput(true)}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-red-900 hover:cursor-pointer"
                  onClick={() => deleteTask(task)}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
