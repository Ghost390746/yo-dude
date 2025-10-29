export default function OSSystemCard({ os }) {
  return (
    <div
      style={{
        border: "1px solid #555",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
      }}
    >
      <h3>{os.name}</h3>
      <p>{os.description}</p>
      <small>Owner ID: {os.owner_id}</small>
    </div>
  );
}
