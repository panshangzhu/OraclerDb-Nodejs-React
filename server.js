const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
let connection;
async function run() {
  try {
    connection = await oracledb.getConnection({
      user: "COMP214_F19_ers_34",
      password: "password",
      connectString: "oracle1.centennialcollege.ca:1521/SQLD"
    });
    if (connection) {
      console.log("connetced to database!");
    }
  } catch (err) {
    console.log("Error: " + err);
  }
}
run();
app.use("/getProducts", (req, res) => {
  try {
    const testQuery = `select idproduct,productname,description,PRODUCTIMAGE,PRICE,ACTIVE from BB_PRODUCT`;
    connection.execute(testQuery, function(err, result) {
      if (err) {
        console.error(err.message);
      }
      if (result.rows.length == 0) {
        res.status(404).send("no data found");
      }
      res.status(200).send(result.rows);
      //console.log(result.rows.length);
    });
  } catch (err) {
    res.status(404).send("cannot find data");
  }
});
app.use("/updateProducts", (req, res) => {
  const { id, description } = req.query;
  try {
    const updateQuery = `BEGIN 
    SP_UPDATE_PRODUCT(${id},'${description}');
    END;`;
    //console.log(description);
    connection.execute(updateQuery, function(err, result) {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        return res.status(200).send("description updated!");
      }
    });
  } catch (err) {
    res.status(404).send("cannot find data");
  }
});
app.use("/addProducts", (req, res) => {
  const { id, name, description, image, price, status } = req.query;
  try {
    const addQuery = `BEGIN 
    PROD_ADD_SP(${id},'${name}','${description}','${image}',${price},${status});
    END;`;
    //console.log(description);
    connection.execute(addQuery, function(err, result) {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        return res.status(200).send("New Product added");
      }
    });
  } catch (err) {
    res.status(404).send("error");
  }
});
app.use("/calculateTax", async (req, res) => {
  const { state, subtotal } = req.query;
  try {
    const calQuery = `BEGIN 
    :p_tax:=TAX_COST_SP('${state}',${subtotal});
  end;`;
    const result = await connection.execute(calQuery, {
      p_tax: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
    });
    console.log(result.outBinds.p_tax);
    return res.status(200).send(result.outBinds);
  } catch (err) {
    res.status(404).send("error");
    console.log(err);
  }
});
app.use("/getOrders", (req, res) => {
  try {
    const getQuery = `select idstatus,idbasket,idstage,dtstage,shipper,shippingnum from BB_basketstatus`;
    connection.execute(getQuery, function(err, result) {
      if (err) {
        console.error(err.message);
      }
      if (result.rows.length == 0) {
        res.status(404).send("no data found");
      }
      res.status(200).send(result.rows);
      //console.log(result.rows.length);
    });
  } catch (err) {
    res.status(404).send("cannot find data");
  }
});
app.use("/updateOrderStatus", async (req, res) => {
  const { idbasket, dtstage, shipper, shippingnum } = req.body;
  console.log(idbasket);
  console.log(dtstage);
  try {
    const updateQuery = `BEGIN STATUS_SHIP_SP(${idbasket},'${dtstage}','${shipper}','${shippingnum}');
    end;`;
    await connection.execute(updateQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        return res.status(200).send("Order Status Changed");
      }
    });
  } catch (err) {
    res.status(404).send("error");
    console.log(err);
  }
});
//task5
app.use("/getBaskets", (req, res) => {
  try {
    const getQuery = `select idbasketitem,idproduct,price,quantity,idbasket,option1,option2 from BB_basketitem`;
    connection.execute(getQuery, function(err, result) {
      if (err) {
        console.error(err.message);
      }
      if (result.rows.length == 0) {
        res.status(404).send("no data found");
      }
      res.status(200).send(result.rows);
      //console.log(result.rows.length);
    });
  } catch (err) {
    res.status(404).send("cannot find data");
  }
});
app.use("/addBaskets", async (req, res) => {
  const { idbasket, idproduct, price, quantity,option1,option2 } = req.body;
  console.log("hello"+idbasket);
  try {
    const addQuery = `BEGIN BASKET_ADD_SP(${idproduct},${price},${quantity},${idbasket},${option1},${option2});
    end;`;
    await connection.execute(addQuery, (err, result) => {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        return res.status(200).send("Item Added");
      }
    });
  } catch (err) {
    res.status(404).send("error");
    console.log(err);
  }
});
app.use("/isSale", async (req, res) => {
  const { id, date } = req.query;
  console.log(date);
  console.log(id);
  try {
    const saleQuery = `BEGIN 
    :isSale:=CK_SALE_SF(${id},'${date}');
  end;`;
    const result = await connection.execute(saleQuery, {
      isSale: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
    });
    console.log(result.outBinds.isSale);
    return res.status(200).send(result.outBinds);
  } catch (err) {
    res.status(404).send("error");
    console.log(err);
  }
});
app.listen(4000, () => console.log("server is listening in port 4000"));
