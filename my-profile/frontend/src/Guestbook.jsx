import { useState, useEffect } from 'react';

const Guestbook = () => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', message: '' });

  // Requirement: GET method implementation
  const fetchComments = async () => {
    const res = await fetch('http://localhost:3000/api/guestbook');
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => { fetchComments(); }, []);

  // Requirement: POST method implementation
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setFormData({ name: '', message: '' });
    fetchComments(); // Refresh the list
  };

  return (
    <div className="guestbook-container">
      <h3>Guestbook</h3>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <textarea 
          placeholder="Message" 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})} 
        />
        <button type="submit">Post</button>
      </form>
      <div className="comments">
        {comments.map((c, i) => (
          <div key={i}><strong>{c.name}:</strong> {c.message}</div>
        ))}
      </div>
    </div>
  );
};

export default Guestbook;