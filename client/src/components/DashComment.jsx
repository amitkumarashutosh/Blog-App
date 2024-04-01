import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComment = () => {
  const [comment, setComment] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [commentId, setCommentId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/comment/all`);
        const data = await res.json();
        if (res.ok) {
          setComment(data.comment);
        }
      } catch (error) {}
    };
    fetchUser();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comment.length;
    try {
      const res = await fetch(`/api/comment/all?skip=${startIndex}&limit=9`);
      const data = await res.json();
      if (res.ok) {
        if (data.comment.length < 9) {
          setShowMore(false);
        }
        setComment([...comment, ...data.comment]);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`/api/comment/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComment(comment.filter((c) => c._id !== id));
      }
    } catch (error) {}
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comment.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Post slug</Table.HeadCell>
              <Table.HeadCell>Comment </Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comment.map((c) => {
              return (
                <Table.Body key={c._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 darK;text-white">
                      {c.postId.slug}
                    </Table.Cell>
                    <Table.Cell>
                      {c.content.length > 30
                        ? `${c.content.substring(0, 30)}...`
                        : c.content}
                    </Table.Cell>
                    <Table.Cell>{c?.userId.username}</Table.Cell>
                    <Table.Cell>{c?.userId.email}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModel(true);
                          setCommentId(c._id);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments</p>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 darK:text0gray-200 mb-4 mx-auto" />
            <h1 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user
            </h1>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  handleDeleteUser(commentId);
                  setShowModel(false);
                }}
              >
                Yes, I'm sure
              </Button>
              <Button onClick={() => setShowModel(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComment;
