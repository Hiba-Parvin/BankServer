const jwt = require("jsonwebtoken")
const db = require('./db')

//Note: register synchronous method, as findOne() method is asynchronous method, register becomes asynchronous method as well. When register method is called from index.js, it has to use promise ie., then() to store data.

register = (acno, uname, psw) => {
  //Storing the resolved output of findOne in a variable user, if present :- it returns object and if not present:- it returns null.
  return db.User.findOne({ acno }).then(user => {
    //if acno is present in db, then oject of that user gets returned else null is returned
    if (user) {
      return {
        status: false,
        message: "Account Already Present",
        statusCode: 404
      }
    }
    else {
      newUser = new db.User({
        username: uname,
        acno,
        password: psw,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        status: true,
        message: "Account Registered Successfully",
        statusCode: 200
      }
    }

  })
  // if (acno in userDetails) {
  //   return {
  //     status:false,
  //     message:"Account Already Present",
  //     statusCode:404
  //   }
  // }
  // else {
  //   userDetails[acno] = { username: uname, acno, password: psw, balance: 0, transaction: [] }
  //   return{
  //     status:true,
  //     message:"Account Registered Successfully",
  //     statusCode:200
  //   }
  // }
}

login = (acno, psw) => {

  return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      //Storing Current User
      currentuser = user.username
      currentacno = acno
      //Token Creation
      const token = jwt.sign({ acno }, "superkey123")
      return {
        status: true,
        message: "Login Successfull",
        statusCode: 200,
        currentuser,
        currentacno,
        token
      }
    }
    else {
      return {
        status: false,
        message: "Incorrect Account No: Or Password",
        statusCode: 404
      }
  }})

}

  // if (acno in userDetails) {
  //   if (psw == userDetails[acno].password) {
  //     //Storing Current User
  //     currentuser = userDetails[acno]["username"]
  //     currentacno = acno
  //     //Token Creation
  //     const token = jwt.sign({ acno }, "superkey123")
  //     return {
  //       status: true,
  //       message: "Login Successfull",
  //       statusCode: 200,
  //       currentuser,
  //       currentacno,
  //       token
  //     }
  //   }
  //   else {
  //     return {
  //       status: false,
  //       message: "Incorrect Password",
  //       statusCode: 404
  //     }
  //   }

  // }
  // else {
  //   return {
  //     status: false,
  //     message: "Account Not Registered",
  //     statusCode: 404
  //   }
  // }


deposit = (acno1, psw1, amnt1) => {
  //Converting String Amount To Integer
  var amount = parseInt(amnt1)

  return db.User.findOne({acno:acno1,password:psw1}).then(user=>{
    if(user){
      user.balance+=amount
      user.transaction.push({Type:"Credit",Amount:amnt1})
      user.save()
      return {
        status: true,
        message: `Your Account Has Been Credited By Amount ${amount}.\nYour Current Balance :${user.balance}`,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "Deposit Failed ! Incorrect Account Number Or Password.",
        statusCode: 402
      }
    }
  })

  // if (acno1 in userDetails) {
  //   if (psw1 == userDetails[acno1]["password"]) {
  //     userDetails[acno1]["balance"] += amount
  //     // Add Transaction Data
  //     userDetails[acno1]["transaction"].push({
  //       Type: "Credit",
  //       Amount: amnt1
  //     })

  //     return {
  //       status: true,
  //       message: `Your Account Has Been Credited By Amount ${amount}.\nYour Current Balance :${userDetails[acno1]["balance"]}`,
  //       statusCode: 200
  //     }

  //   }
  //   else {
  //     return {
  //       status: false,
  //       message: "Deposit Failed ! Incorrect Account Number Or Password.",
  //       statusCode: 402
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     message: "Invalid Form",
  //     statusCode: 402
  //   }
  // }
}

withdraw = (acno2, psw2, amnt2) => {
  var amount = parseInt(amnt2)
  return db.User.findOne({acno:acno2,password:psw2}).then(user=>{
    if(user){
      if(user.balance>=amount){
      
      user.balance-=amount
      user.transaction.push({Type:"Debit",Amount:amnt2})
      user.save()
      return {
        status: true,
        message: `Your Account Has Been Debited By Amount ${amount}.\nYour Current Balance :${user.balance}`,
        statusCode: 200
      }
    }
  else{
    return {
      status: false,
      message: "Insufficient Balance",
      statusCode: 402
    }
    }
  }
    else {
      return {
        status: false,
        message: "Withdraw Failed ! Incorrect Account Number Or Password.",
        statusCode: 402
      }
    }

  })

  // if (acno2 in userDetails) {
  //   if (psw2 == userDetails[acno2]["password"]) {
  //     if (userDetails[acno2]["balance"] >= amount) {
  //       userDetails[acno2]["balance"] -= amount
  //       console.log("Withdraw : ", userDetails[acno2]["balance"]);
  //       // Add Transaction Data
  //       userDetails[acno2]["transaction"].push({
  //         Type: "Debit",
  //         Amount: amount
  //       })
  //       console.log("Withdraw : ", userDetails[acno2]);
  //       return {
  //         status: true,
  //         message: `Your Account Has Been Debited By Amount ${amount}.\nYour Current Balance :${userDetails[acno2]["balance"]}`,
  //         statusCode: 200
  //       }

  //     }
  //     return {
  //       status: false,
  //       message: "Insufficient Balance",
  //       statusCode: 402
  //     }
  //   }
  //   else {
  //     return {
  //       status: false,
  //       message: "Withdraw Failed ! Incorrect Account Number Or Password.",
  //       statusCode: 402
  //     }
  //   }
  // }
  // else {
  //   return {
  //     status: false,
  //     message: "Invalid Form",
  //     statusCode: 402
  //   }
  // }
}

getTransaction = (acno) => {
  return db.User.findOne({acno}).then(user => {
    if (user) {
      return {
        status: true,
        transaction: user.transaction,
        statusCode: 200
      }
    }
  })

}

deleteAcc=(acno)=>{
  return db.User.deleteOne({acno}).then(user => {
    if (user) {
      return {
        status: true,
        message: "Your Account Has Been Deleted !" ,        
        statusCode: 200
      }
    }
    else{
            return {
        status: false,
        message: "Account Not Found !",
        statusCode: 402
      }
    }
  })
}
  

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}