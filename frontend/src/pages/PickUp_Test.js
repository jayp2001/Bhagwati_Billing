/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
import React, { useState, useRef } from 'react';
import { TextField, Button, Input } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import './css/pickUp.css';
import './css/pickUp1.css';
import Header from '../components/Header/Header';
import { IoIosRestaurant } from "react-icons/io";
import Button1 from '../components/Button/Button1';
import { MdCancel } from "react-icons/md";
import { MdOutlineCurrencyExchange } from "react-icons/md";




const PickUp_Test = () => {
  const data = [
    {
      "shortName": "BT",
      "shortCode": 22,
      "Name": "Butter Tika - BT",
      "unitOptions": ["kg", "g", "lb", "oz"]
    },
    {
      "shortName": "CG",
      "shortCode": 33,
      "Name": "Cheese Garlic Bread",
      "unitOptions": ["kg", "g", "piece"]
    },
    {
      "shortName": "FP",
      "shortCode": 44,
      "Name": "French Pizza",
    }
  ];

  const [fullFormData, setFullFormData] = useState({
    inputCode: '',
    inputName: '',
    inputQuantity: 1,
    inputUnit: '',
    comment: ''
  });

  const [items, setItems] = useState([]);
  const [buttonCLicked, setButtonCLicked] = useState('tab1')
  const quantityInputRef = useRef(null);
  const unitInputRef = useRef(null);
  const commentInputRef = useRef(null);
  const first = useRef(null);
  const handleInputCodeChange = (e) => {
    const value = e.target.value;
    setFullFormData(prevState => ({
      ...prevState,
      inputCode: value
    }));

    if (e.key === 'Enter') {
      e.preventDefault();
      quantityInputRef.current && quantityInputRef.current.focus();
    }

    const matchingProduct = data.find(item => item.shortCode.toString() === value);
    if (matchingProduct) {
      setFullFormData(prevState => ({
        ...prevState,
        inputName: matchingProduct.Name
      }));
    }
  };
  const handleInputNameChange = (e, value) => {
    const filtered = value ? data.filter(item =>
      (item.shortName && item.shortName.toLowerCase().includes(value.toLowerCase())) ||
      (item.Name && item.Name.toLowerCase().includes(value.toLowerCase()))
    ) : [];

    setFullFormData(prevState => ({
      ...prevState,
      inputName: value
    }));

    if (filtered.length === 1) {
      setFullFormData(prevState => ({
        ...prevState,
        inputCode: filtered[0].shortCode.toString()
      }));
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setFullFormData(prevState => ({
      ...prevState,
      inputQuantity: value
    }));

    if (e.key === 'Enter') {
      e.preventDefault();
      if (unitOptionsExist(fullFormData.inputName)) {
        unitInputRef.current && unitInputRef.current.focus();
      } else {
        commentInputRef.current && commentInputRef.current.focus();
      }
    }
  };
  const handleUnitChange = (e) => {
    const value = e.target.value;
    const options = unitOptionsExist(fullFormData.inputName) ? data.find(item => item.Name === fullFormData.inputName).unitOptions : [];

    if (!isNaN(value)) {
      const index = parseInt(value) - 1;
      if (index >= 0 && index < options.length) {
        setFullFormData(prevState => ({
          ...prevState,
          inputUnit: options[index]
        }));
      }
    } else {
      const optionIndex = options.findIndex(option => option.toLowerCase() === value.toLowerCase());
      if (optionIndex !== -1) {
        setFullFormData(prevState => ({
          ...prevState,
          inputUnit: options[optionIndex]
        }));
      } else {
        setFullFormData(prevState => ({
          ...prevState,
          inputUnit: ''
        }));
      }
    }
  };

  const handleAutofill = (name, code) => {
    setFullFormData(prevState => ({
      ...prevState,
      inputCode: code.toString(),
      inputName: name
    }));

    commentInputRef.current && commentInputRef.current.focus();
  };

  const handleEnterPressFirst = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      quantityInputRef.current && quantityInputRef.current.focus();
    }
  };

  const handleEnterPressThird = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commentInputRef.current && commentInputRef.current.focus();
    }
  };

  const handleEnterPressSecond = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (unitOptionsExist(fullFormData.inputName)) {
        unitInputRef.current && unitInputRef.current.focus();
      } else {
        commentInputRef.current && commentInputRef.current.focus();
      }
    }
  };

  const handleAddItem = (e) => {
    if (e.key === 'Enter') {
      if (fullFormData.inputName !== '') {

        const newItem = {
          inputCode: fullFormData.inputCode,
          inputName: fullFormData.inputName,
          inputQuantity: fullFormData.inputQuantity,
          comment: fullFormData.comment
        };

        setItems(prevItems => [...prevItems, newItem]);

        setFullFormData({
          inputCode: '',
          inputName: '',
          inputQuantity: 1,
          inputUnit: '',
          comment: ''
        });

        if (unitOptionsExist(fullFormData.inputName)) {
          unitInputRef.current && unitInputRef.current.focus();
        } else {
          commentInputRef.current && commentInputRef.current.focus();
        }

        first.current && first.current.focus();
        e.target.value = ''
      }
      else {

      }
    }
  };
  const handleReset = (e) => {
    setFullFormData({
      inputCode: '',
      inputName: '',
      inputQuantity: 1,
      inputUnit: '',
      comment: ''
    });

    if (unitOptionsExist(fullFormData.inputName)) {
      unitInputRef.current && unitInputRef.current.focus();
    } else {
      commentInputRef.current && commentInputRef.current.focus();
    }

    first.current && first.current.focus();
    e.target.value = ''
  }

  const unitOptionsExist = (Name) => {
    const product = data.find(item => item.Name === Name);
    return product && product.unitOptions && product.unitOptions.length > 0;
  }
  const handleDeleteRow = (index) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };
  const handleIncreaseQuantity = (index) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].inputQuantity += 1;
      return updatedItems;
    });
  };

  const handleDecreaseQuantity = (index) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      if (updatedItems[index].inputQuantity > 1) {
        updatedItems[index].inputQuantity -= 1;
      }
      return updatedItems;
    });
  };
  return (
    <div className=''>
      <Header />
      <section className='left_section '>
        <div className=" w-full p-0 my-2">
          <div className="flex">
            <div className="Righ_bill_menu mx-6">
              <div className="w-full rounded-md">
                {
                  buttonCLicked === 'tab1' && (
                    <div className="w-full table_no p-2">
                      <div className="shadow-md my-4 p-2">
                        <p className="w-20">Table No </p>
                        <hr />
                        <div className="py-2 flex justify-between main_div ">
                          <div>
                            <span className='w-3'>Enter No &nbsp;</span> <input type="text" name="" id="" className="w-20 p-1 border-2 rounded-sm" />
                          </div>
                          <div>
                            <Button1>Assign Captain</Button1>
                          </div>
                        </div>
                      </div>
                      <div className="shadow-md my-2 p-2">
                        <p className="w-32 mb-2">Customer Details</p>
                        <hr />
                        <table className="my-2 h-44 w-full">
                          <tbody>
                            <tr className='mb-3'>
                              <td className="w-5">Mobile&nbsp;</td>
                              <td><input type="number" className="border-2 w-48 p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Name&nbsp;</td>
                              <td><input type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Add&nbsp;</td>
                              <td><input type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Locality&nbsp;</td>
                              <td><input type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                          </tbody>
                        </table>

                      </div>
                      <div className="shadow-md my-2 p-2">
                        <div className="w-full py-2 my-2">
                          <span className="w-3">Order Comment&nbsp;</span> <input type="text" name="" id="" className="w-80 p-1 border-2 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  (buttonCLicked === 'tab3' || buttonCLicked === 'tab2') && (
                    <div className="w-full table_no p-2">
                      <div className="shadow-md my-2 p-2">
                        <p className="w-32 mb-2">Customer Details</p>
                        <hr />
                        <table className="my-2 h-44 w-full">
                          <tbody>
                            <tr className='mb-3'>
                              <td className="w-5">Mobile&nbsp;</td>
                              <td><input type="number" className="border-2 w-48 p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Name&nbsp;</td>
                              <td><input type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Add&nbsp;</td>
                              <td><input type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Locality&nbsp;</td>
                              <td><input type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                          </tbody>
                        </table>

                      </div>
                      <div className="shadow-md my-2 p-2">
                        <div className="w-full py-2 my-2">
                          <span className="w-3">Order Comment&nbsp;</span> <input type="text" name="" id="" className="w-80 p-1 border-2 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  buttonCLicked === 'tab4' && (
                    <div>
                      <div className="shadow-md my-4 p-2">
                        <p className="w-full">Hotel Information </p>
                        <hr />
                        <div className="py-2 flex justify-between main_div ">
                          <div className='w-80'>
                            <Autocomplete
                              className='hotel_autocomplete'
                              options={unitOptionsExist(fullFormData.inputName) ? data.find(item => item.Name === fullFormData.inputName).unitOptions : []}
                              value={fullFormData.inputUnit}
                              renderInput={(params) => <TextField {...params} inputRef={unitInputRef} onChange={handleUnitChange} className='hotel_input' placeholder="Hotel Name" variant="outlined" />}
                            />
                          </div>
                          <div>
                            <span className='w-3'>Room No &nbsp;</span> <input type="text" name="" id="" className="w-20 p-1 border-2 rounded-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="shadow-md my-4 p-2">
                        <table className="my-2 h-44 w-full">
                          <tbody>
                            <tr className='mb-3'>
                              <td className="w-5">Mobile&nbsp;</td>
                              <td><input type="number" className="border-2 w-48 p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Name&nbsp;</td>
                              <td><input type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                          </tbody>
                        </table>

                      </div>
                    </div>
                  )
                }
              </div>
            </div>
            <div className="left_bill_menu">
              <div className=" w-full p-0 text-white">
                <div className="grid grid-flow-row grid-cols-12 mr-2  bg-gray-700">
                  <div className={buttonCLicked == 'tab1' ? "clicked col-3 p-0 col-span-3 text-center" : 'col-3 p-0  col-span-3 text-center'}>
                    <Button onClick={() => setButtonCLicked('tab1')} variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Dine In</Button>
                  </div>
                  <div className={buttonCLicked == 'tab2' ? "clicked col-3 p-0  col-span-3 text-center" : 'col-3 p-0  col-span-3 text-center'}>
                    <Button onClick={() => setButtonCLicked('tab2')} variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Delivery</Button>
                  </div>
                  <div className={buttonCLicked == 'tab3' ? "clicked col-3 p-0  col-span-3 text-center" : 'col-3 p-0  col-span-3 text-center'}>
                    <Button onClick={() => setButtonCLicked('tab3')} variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Pick Up</Button>
                  </div>
                  <div className={buttonCLicked == 'tab4' ? "clicked col-3 p-0  col-span-3 text-center" : "col-3 p-0  col-span-3 text-center"}>
                    <Button onClick={() => setButtonCLicked('tab4')} variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Hotel</Button>
                  </div>
                </div>
              </div>
              <div className=" mr-2 p-0">
                <div className="bg-gray-200">
                  <div className="grid grid-cols-12 p-2">
                    <div className="col-span-3 justify-self-center underline color-gray-700 pl-3">ITEMS</div>
                    <div className="col-span-3 justify-self-end">COMMENTS</div>
                    <div className="col-span-3 justify-self-center">QTY.</div>
                    <div className="col-span-3 justify-self-end pr-3">PRICE</div>
                  </div>
                </div>
                <div className="bill_tag  ">
                  {
                    items.length === 0 && (
                      <div className='text-center h-full flex flex-col justify-center align-middle main_div'>
                        <p className='text-lg text-gray-600'>No items Added</p>
                        <p>Please add the item First</p>
                        <IoIosRestaurant className='Billing_icon text-center ms-3' />
                      </div>
                    )
                  }
                  {items.map((item, index) => (
                    <div key={index} className="bg-amber-50 p-2">
                      <div className="grid grid-cols-12 content-center gap-4">
                        <div className="col-auto underline">
                          <MdCancel onClick={() => handleDeleteRow(index)} className='main_bill_icon text-red-700 ml-1 mt-1 cursor-pointer' />
                        </div>
                        <div className="col-span-4 justify-self-start">{item.inputName}</div>
                        <div className="col-span-2 justify-self-center">{item.comment}</div>
                        <div className="col-span-2 justify-self-start">
                          <div className="flex h-full align-star main_div">
                            <div className="plus_button">
                              <button onClick={() => handleDecreaseQuantity(index)} className='border quantity_button p-0'>-</button>
                            </div>
                            <input type="text" value={item.inputQuantity} className='w-8 text-center' readOnly />
                            <div className="plus_button">
                              <button onClick={() => handleIncreaseQuantity(index)} className='quantity_button p-0'>+</button>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3 justify-self-end">
                          <p className="pl-2">123</p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
              <div>
                <div className="w-full p-2 h-full bg-gray-700 text-white">
                  <div className="flex w-full justify-around gap-4 main_div">
                    <div>
                      <Button1>Split</Button1>
                    </div>
                    <div>
                      <Button1>Advance Order</Button1>
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <div>
                          <input type="checkbox" name="" id="" />
                        </div>
                        <p>Complementary</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2 main_div">
                        <div className='bg-red-600 p-1'>
                          <MdOutlineCurrencyExchange className='text-white text-lg' />
                        </div>
                        <p>Total:-</p>
                        <p>329</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full p-2 flex bg-gray-300 gap-28 justify-center">
                <div><input type="radio" name="payment-method" /> <span>Cash</span></div>
                <div><input type="radio" name="payment-method" /> <span>Card</span></div>
                <div><input type="radio" name="payment-method" /> <span>Due</span></div>
                <div><input type="radio" name="payment-method" /> <span>Other</span></div>
                <div><input type="radio" name="payment-method" /> <span>Port</span></div>
              </div>

              <div className="w-full flex p-2 justify-center gap-4 bg-gray-500">
                <div><input type="checkbox" /></div>
                <div>It's Paid</div>
              </div>
              <div className="w-full flex justify-center p-1 mt-1 gap-10">
                <div><Button1>Save</Button1></div>
                <div><Button1>Print & Bill</Button1></div>
                <div><Button1 className='another_1'>KOT</Button1></div>
                <div><Button1 className='another_1'>KOT & PRINT</Button1></div>
                <div><Button1 className='another_2'>HOLD</Button1></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PickUp_Test