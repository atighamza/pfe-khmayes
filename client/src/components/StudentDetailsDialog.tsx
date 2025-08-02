// // StudentDetailsDialog.tsx
// import { Dialog, DialogTitle, DialogContent } from "@mui/material";
// import { useState, useEffect } from "react";

// export default function StudentDetailsDialog({
//   open,
//   onClose,
//   post,
//   onStatusChange,
// }) {
//   const [status, setStatus] = useState(post?.status || "pending");

//   useEffect(() => {
//     if (post) setStatus(post.status);
//   }, [post]);

//   const handleChange = (e) => {
//     const newStatus = e.target.value;
//     setStatus(newStatus);
//     onStatusChange(post._id, newStatus, post);
//   };

//   if (!post) return null;

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>Student Application Details</DialogTitle>
//       <DialogContent className="space-y-4">
//         <p>
//           <strong>Name:</strong> {post.studentId?.name}
//         </p>
//         <p>
//           <strong>Email:</strong> {post.studentId?.email}
//         </p>

//         <div>
//           <label className="block font-semibold mb-1">Application Status</label>
//           <select
//             value={status}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           >
//             <option value="pending">Keep it</option>
//             <option value="rh">RH Interview</option>
//             <option value="technical">Technical Interview</option>
//             <option value="accepted">Accepted</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>

//         <div>
//           <p className="font-semibold mb-1">Resume</p>
//           <a
//             href={`http://localhost:5000${post?.resumeUrl}`}
//             target="_blank"
//             rel="noreferrer"
//             className="text-blue-600 underline"
//           >
//             View CV
//           </a>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
// StudentDetailsDialog.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  post: any;
  onStatusChange: (postId: string, status: string, post: any) => void;
  onDelete: (postId: string) => void;
}

export default function StudentDetailsDialog({
  open,
  onClose,
  post,
  onStatusChange,
  onDelete,
}: StudentDetailsDialogProps) {
  const [status, setStatus] = useState(post?.status || "pending");

  useEffect(() => {
    if (post) setStatus(post.status);
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onStatusChange(post._id, newStatus, post);
  };

  const handleDelete = () => {
    if (post && post._id) {
      onDelete(post._id);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Student Application Details</DialogTitle>
      <DialogContent className="space-y-4">
        <p>
          <strong>Name:</strong> {post.studentId?.name}
        </p>
        <p>
          <strong>Email:</strong> {post.studentId?.email}
        </p>

        <div>
          <label className="block font-semibold mb-1">Application Status</label>
          <select
            value={status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="pending">Keep it</option>
            <option value="rh">RH Interview</option>
            <option value="technical">Technical Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {post.resumeUrl ? (
          <div>
            <p className="font-semibold mb-1">Resume</p>
            <a
              href={`http://localhost:5000${post?.resumeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View CV
            </a>
          </div>
        ) : (
          <p className="text-gray-500">No resume uploaded.</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Delete Application
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
