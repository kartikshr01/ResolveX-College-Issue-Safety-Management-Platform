// import { useState } from "react";
// import './CreateTicket.css';

// function CreateTicket() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     departmentId: "",
//     category: "",
//     location: "",
//     priority: "",
//     safetyFlag: false,
//     image: null,
//   });

//   return (
//     <div>
//       <h1>Report an Issue</h1>
//       {/* Issue Title */}
//       <div>
//         <label htmlFor="title">Issue Title</label>

//         <input
//           id="title"
//           type="text"
//           value={formData.title}
//           onChange={(event) =>
//             setFormData({
//               ...formData,
//               title: event.target.value,
//             })
//           }
//           placeholder="Enter the issue title"
//         />
//       </div>

//       {/* Description */}
//       <div>
//         <label htmlFor="description">Description</label>

//         <textarea
//           id="description"
//           value={formData.description}
//           onChange={(event) =>
//             setFormData({
//               ...formData,
//               description: event.target.value,
//             })
//           }
//           placeholder="Describe the issue in detail"
//           rows="5"
//         />
//       </div>

//       {/* Location */}
//       <div>
//         <label htmlFor="location">Location</label>

//         <input
//           id="location"
//           type="text"
//           value={formData.location}
//           onChange={(event) =>
//             setFormData({
//               ...formData,
//               location: event.target.value,
//             })
//           }
//           placeholder="Example: Block B, 2nd Floor"
//         />
//       </div>

//       {/* Category */}
//       <div>
//         <label htmlFor="category">Category</label>

//         <select
//           id="category"
//           value={formData.category}
//           onChange={(event) =>
//             setFormData({
//               ...formData,
//               category: event.target.value,
//             })
//           }
//         >
//           <option value="">Select a category</option>
//           <option value="electrical">Electrical</option>
//           <option value="plumbing">Plumbing</option>
//           <option value="it">IT / Wi-Fi</option>
//           <option value="furniture">Furniture</option>
//           <option value="cleanliness">Cleanliness</option>
//           <option value="infrastructure">Infrastructure</option>
//           <option value="other">Other</option>
//         </select>
//       </div>

//       {/* Priority */}
//       <div>
//         <label htmlFor="priority">Priority</label>

//         <select
//           id="priority"
//           value={formData.priority}
//           onChange={(event) =>
//             setFormData({
//               ...formData,
//               priority: event.target.value,
//             })
//           }
//         >
//           <option value="">Select priority</option>
//           <option value="low">Low</option>
//           <option value="medium">Medium</option>
//           <option value="high">High</option>
//           <option value="critical">Critical</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// export default CreateTicket;


import { useState } from "react";
import "./CreateTicket.css";

function CreateTicket() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    departmentId: "",
    category: "",
    location: "",
    priority: "",
    safetyFlag: false,
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("departmentId", formData.departmentId);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("priority", formData.priority);
      data.append("safetyFlag", formData.safetyFlag);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create ticket");
      }

      setMessage("Ticket created successfully!");

      setFormData({
        title: "",
        description: "",
        departmentId: "",
        category: "",
        location: "",
        priority: "",
        safetyFlag: false,
        image: null,
      });

      document.getElementById("ticket-image").value = "";
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">
      {" "}
      <div className="create-ticket-card">
        {" "}
        <div className="create-ticket-header">
          {" "}
          <h1>Report an Issue</h1>{" "}
          <p>
            Submit an issue and our team will assign it to the appropriate
            technician.{" "}
          </p>{" "}
        </div>
        {message && <div className="ticket-message success">{message}</div>}
        {error && <div className="ticket-message error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Issue Title <span>*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the issue title"
              minLength={5}
              maxLength={150}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Description <span>*</span>
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              rows={5}
              minLength={10}
              maxLength={2000}
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">
              Location <span>*</span>
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Block B, 2nd Floor"
              maxLength={200}
              required
            />
          </div>

          {/* Department */}
          <div className="form-group">
            <label htmlFor="departmentId">
              Department <span>*</span>
            </label>

            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
            >
              <option value="">Select a department</option>

              <option value="6a8d3cfd07eee994e9f60199">Electrical</option>

              <option value="6a8d3cfd07eee994e9f6019a">Plumbing</option>

              <option value="6a8d3cfd07eee994e9f6019b">IT Support</option>

              <option value="6a8d3cfd07eee994e9f6019d">Housekeeping</option>

              <option value="6a8d3cfd07eee994e9f6019c">
                General Maintainance and Infrastructure
              </option>
              <option value="6a8d3cfd07eee994e9f6019e">Security</option>
              <option value="6a8d3cfd07eee994e9f6019f">
                General Maintenance
              </option>
            </select>
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">
              Category <span>*</span>
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="it">IT</option>
              <option value="furniture">Furniture</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority">
              Priority <span>*</span>
            </label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Safety */}
          <div className="safety-option">
            <input
              id="safetyFlag"
              name="safetyFlag"
              type="checkbox"
              checked={formData.safetyFlag}
              onChange={handleChange}
            />

            <label htmlFor="safetyFlag">
              <strong>Safety issue</strong>
              <small>Check this if the issue may create a safety risk.</small>
            </label>
          </div>

          {/* Image */}
          <div className="form-group">
            <label htmlFor="ticket-image">Attach Image</label>

            <input
              id="ticket-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />

            <small className="file-help">
              Upload an image showing the issue, if available.
            </small>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-ticket-button"
            disabled={loading}
          >
            {loading ? "Creating Ticket..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;