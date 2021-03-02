import React, { useEffect, useState } from "react";
import CustomerForm from "./CustomerForm";
import CustomerList from "./CustomerList";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);

  async function getCustomers() {
    const customersRes = await axios.get("http://localhost:5000/customer/");
    setCustomers(customersRes.data);
  }

  useEffect(() => {
    getCustomers();
  }, []);
  return (
    <div>
      <CustomerForm getCustomers={getCustomers} />
      <CustomerList customers={customers} />
    </div>
  );
}

export default Customers;
