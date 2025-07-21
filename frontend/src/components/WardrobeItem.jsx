const WardrobeItem = ({ item }) => {
  return (
    <div>
      <img
        src={`http://localhost:8000${item.image}`}
        alt={item.name}
        style={{ width: '150px', borderRadius: '8px' }}
      />
      <p>{item.name}</p>
    </div>
  );
};

export default WardrobeItem;
