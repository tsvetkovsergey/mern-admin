import Product from '../models/Product.js';
import ProductStat from '../models/ProductStat.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import getCountryIso3 from 'country-iso-2-to-3';

// Get all products with stats
export const getProducts = async (req, res) => {
  try {
    // Get all products from db
    const products = await Product.find();

    // Get stats for each product
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.findOne({ productId: product._id });
        return { ...product._doc, stat };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    // Get all customers from db
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    // 'sort' should look like this: sort = { "field": "userId", "sort": "desc" }
    const { page = 1, pageSize = 20, sort = null, search = '' } = req.query;

    // formatted 'sort' should look like this: { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      return { [sortParsed.field]: sortParsed.sort === 'desc' ? -1 : 1 };
    };
    const sortFormatted = sort ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, 'i') } },
        { userId: { $regex: new RegExp(search, 'i') } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: 'i' },
    });

    res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => ({ id: country, value: count })
    );

    // const mappedUsers = users.reduce((acc, { country }) => {
    //   const countryISO3 = getCountryIso3(country);
    //   const index = acc.findIndex(
    //     (country) => country.id && country.id === countryISO3
    //   );
    //   if (index === -1) {
    //     return [...acc, { id: countryISO3, value: 1 }];
    //   }
    //   acc[index].value++;
    //   return acc;
    // }, []);
    // res.status(200).json(mappedUsers);
    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
