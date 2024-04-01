import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiOutlineUserGroup,
  HiDocumentText,
  HiAnnotation,
} from "react-icons/hi";

const DashActivity = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/${currentUser._id}?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setTotalUsers(data.totalUsers);
          setUsers(data.usersWithoutPassword);
        }
      } catch (error) {}
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post?userId=${currentUser._id}?limit=5`);
        const data = await res.json();

        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
        }
      } catch (error) {}
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/all?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comment);
          setTotalComments(data.count);
        }
      } catch (error) {}
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser._id]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiDocumentText className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiAnnotation className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashActivity;
