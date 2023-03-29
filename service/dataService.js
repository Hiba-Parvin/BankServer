  const jwt=require("jsonwebtoken")
  
  userDetails= {
    1001: { username: "Rhysand", acno: 1001, password: "abc", balance: 0, transaction: [] },
    1002: { username: "Amren", acno: 1002, password: "abc", balance: 0, transaction: [] },
    1003: { username: "Cassian", acno: 1003, password: "abc", balance: 0, transaction: [] },
    1004: { username: "Azriel", acno: 1004, password: "abc", balance: 0, transaction: [] },
    1005: { username: "Lyssandra", acno: 1005, password: "abc", balance: 0, transaction: [] },
    1006: { username: "Yrene", acno: 1006, password: "abc", balance: 0, transaction: [] },
  }


register=(acno, uname, psw)=> {
    if (acno in userDetails) {
      return {
        status:false,
        message:"Account Already Present",
        statusCode:404
      }
    }
    else {
      userDetails[acno] = { username: uname, acno, password: psw, balance: 0, transaction: [] }
      return{
        status:true,
        message:"Account Registered Successfully",
        statusCode:200
      }
    }
  }

  login=(acno, psw)=> {
    if (acno in userDetails) {
      if (psw == userDetails[acno].password) {
        //Storing Current User
        currentuser = userDetails[acno]["username"]
        currentacno = acno
        //Token Creation
        const token=jwt.sign({acno},"superkey123")
        return{
            status:true,
            message:"Login Successfull",
            statusCode:200,
            currentuser,
            currentacno,
            token
          }
      }
      else {
        return {
            status:false,
            message:"Incorrect Password",
            statusCode:404
          }
      }

    }
    else {
      return {
        status:false,
        message:"Account Not Registered",
        statusCode:404
      }
    }
  }

  deposit=(acno1, psw1, amnt1)=>{
    //Converting String Amount To Integer
    var amount = parseInt(amnt1)

    if (acno1 in userDetails) {
      if (psw1 == userDetails[acno1]["password"]) {
        userDetails[acno1]["balance"] += amount
        // Add Transaction Data
        userDetails[acno1]["transaction"].push({
          Type: "Credit",
          Amount: amnt1
        })

        return {
            status:true,
            message:`Your Account Has Been Credited By Amount ${amount}.\nYour Current Balance :${userDetails[acno1]["balance"]}`,
            statusCode:200
          }

      }
      else {
        return {
            status:false,
            message:"Deposit Failed ! Incorrect Account Number Or Password.",
            statusCode:402
        }
      }
    }
    else {
        return {
            status:false,
            message:"Invalid Form",
            statusCode:402
        }
    }
  }

  withdraw=(acno2, psw2, amnt2)=> {
    var amount = parseInt(amnt2)

    if (acno2 in userDetails) {
      if (psw2 == userDetails[acno2]["password"]) {
        if (userDetails[acno2]["balance"] >= amount) {
          userDetails[acno2]["balance"] -= amount
          console.log("Withdraw : ", userDetails[acno2]["balance"]);
          // Add Transaction Data
          userDetails[acno2]["transaction"].push({
            Type: "Debit",
            Amount: amount
          })
          console.log("Withdraw : ", userDetails[acno2]);
          return{
            status:true,
            message:`Your Account Has Been Debited By Amount ${amount}.\nYour Current Balance :${userDetails[acno2]["balance"]}`,
            statusCode:200
          }

        }
        return {
            status:false,
            message:"Insufficient Balance",
            statusCode:402
        }
      }
      else {
        return {
            status:false,
            message:"Withdraw Failed ! Incorrect Account Number Or Password.",
            statusCode:402
        }
      }
    }
    else {
        return {
            status:false,
            message:"Invalid Form",
            statusCode:402
        }
    }
  }

  getTransaction=(acno) =>{

    return{
      status:true,
      transaction:userDetails[acno].transaction,
      statusCode:200
    }
  }

  module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction
  }