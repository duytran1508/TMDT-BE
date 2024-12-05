const Address = require("../models/AddressModel");

const addAddress = async (userId, addressData) => {
  let userAddress = await Address.findOne({ userId });

  if (!userAddress) {
    userAddress = new Address({ userId, addresses: [addressData] });
  } else {
    const isDuplicate = userAddress.addresses.some(
      (addr) =>
        addr.name === addressData.name &&
        addr.phone === addressData.phone &&
        addr.address === addressData.address &&
        addr.main === addressData.main
    );

    if (isDuplicate) {
      return { status: 200, message: "Duplicate address, not saved." };
    }

    userAddress.addresses.push(addressData);
  }

  await userAddress.save();
  return { status: 200, message: "Address added successfully." };
};

const getAddressesByUserId = async (userId) => {
  const userAddress = await Address.findOne({ userId });
  if (!userAddress) {
    return [];
  }
  return userAddress.addresses;
};

const deleteAddress = async (userId, addressId) => {
  const userAddress = await Address.findOne({ userId });
  if (!userAddress) {
    throw new Error("User not found or no addresses available");
  }

  const updatedAddresses = userAddress.addresses.filter(
    (address) => address._id.toString() !== addressId
  );

  if (updatedAddresses.length === userAddress.addresses.length) {
    throw new Error("Address not found");
  }

  userAddress.addresses = updatedAddresses;
  await userAddress.save();

  return { message: "Address deleted successfully" };
};

module.exports = { addAddress, getAddressesByUserId, deleteAddress };
