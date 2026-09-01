import { useState } from "react";

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

  return (
    <div>
      <h1>Report an Issue</h1>
      {/* Issue Title */}
      <div>
        <label htmlFor="title">Issue Title</label>

        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(event) =>
            setFormData({
              ...formData,
              title: event.target.value,
            })
          }
          placeholder="Enter the issue title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          value={formData.description}
          onChange={(event) =>
            setFormData({
              ...formData,
              description: event.target.value,
            })
          }
          placeholder="Describe the issue in detail"
          rows="5"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location">Location</label>

        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(event) =>
            setFormData({
              ...formData,
              location: event.target.value,
            })
          }
          placeholder="Example: Block B, 2nd Floor"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category">Category</label>

        <select
          id="category"
          value={formData.category}
          onChange={(event) =>
            setFormData({
              ...formData,
              category: event.target.value,
            })
          }
        >
          <option value="">Select a category</option>
          <option value="electrical">Electrical</option>
          <option value="plumbing">Plumbing</option>
          <option value="it">IT / Wi-Fi</option>
          <option value="furniture">Furniture</option>
          <option value="cleanliness">Cleanliness</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority">Priority</label>

        <select
          id="priority"
          value={formData.priority}
          onChange={(event) =>
            setFormData({
              ...formData,
              priority: event.target.value,
            })
          }
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
    </div>
  );
}

export default CreateTicket;
