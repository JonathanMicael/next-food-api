module.exports = (status, msg = "", data = {}) => ({
  code: status,
  message: msg,
  data
});
