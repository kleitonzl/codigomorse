export const handleError = (res, err, message) => {
  console.error(message, err);
  res.status(500).json({ message });
};
