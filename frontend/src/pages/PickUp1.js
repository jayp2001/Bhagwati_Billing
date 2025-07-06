/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Header from '../components/Header/Header'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import './css/pickUp.css'
import './css/pickUp1.css'
import { BsPerson } from "react-icons/bs";
import { TbFilePencil } from "react-icons/tb";
import { MdCancel, MdOutlineCurrencyExchange, MdOutlineTableBar } from "react-icons/md";
import { IoIosRestaurant } from 'react-icons/io';
import Button1 from '../components/Button/Button1'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const PickUp1 = () => {
  const [buttonCLicked, setButtonCLicked] = useState('tab1')
  const [billineMenu, setBillineMenu] = useState(true)
  const [miniBillingMenu, setMiniBillingMenu] = useState(false)
  const [items, setItems] = useState([]);
  const [noItemsDesign, setnoItemsDesign] = useState(true);



  const [dineInCustomerDetails, setDineInCustomerDetails] = useState({
    mobile: '',
    name: '',
    address: '',
    locality: '',
  });
  const [dineInOrderComment, setDineInOrderComment] = useState('');

  const [deliveryCustomerDetails, setDeliveryCustomerDetails] = useState({
    mobile: '',
    name: '',
    address: '',
    locality: '',
  });
  const [deliveryOrderComment, setDeliveryOrderComment] = useState('');

  const [pickUpCustomerDetails, setPickUpCustomerDetails] = useState({
    mobile: '',
    name: '',
    address: '',
    locality: '',
  });
  const [pickUpOrderComment, setPickUpOrderComment] = useState('');

  const [hotelDetails, setHotelDetails] = useState({});

  useEffect(() => {
    if (dineInCustomerDetails || dineInOrderComment ||
      deliveryCustomerDetails || deliveryOrderComment ||
      pickUpCustomerDetails || pickUpOrderComment) {
      setnoItemsDesign(true);
    }
    else {
      setnoItemsDesign(false)
    }
  }, [dineInCustomerDetails, dineInOrderComment, deliveryCustomerDetails, deliveryOrderComment, pickUpCustomerDetails, pickUpOrderComment]);
  const toggleBillingMenu = () => {
    setBillineMenu(true);
    setDineInCustomerDetails(false)
    setDeliveryCustomerDetails(false)
    setPickUpCustomerDetails(false)
  };
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
  const [text, setText] = useState("");

  return (
    <div>
      <div className="z-50" z>
        <Header />
      </div>
      <div className="flex w-full">
        <section className="right_section_1 w-1/2">
          <div className="flex h-full">
            <div className="w-1/4 h-full">
              <ul className="flex flex-col h-full bg-gray-300">
                <li className='p-2'>Hello1</li>
                <li className='p-2'>Hello 2</li>
              </ul>
            </div>
            <div className="w-3/4 bg-gray-100 ">
              <div className="flex m-2 p-2 flex-wrap">
                <div className="main_card">
                  <div className="card  h-full flex bg-white shadow-xl rounded-lg m-2">
                    <Divider orientation="vertical" flexItem className='card_sideBar' />
                    <div className="card_text w-36 p-2 py-4 pr-4">
                      Corporate Lunch
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="left_Section w-1/2">
          <div className="w-full overflow-hidden h-max">
            <div className=" w-full p-0 text-white text-base">
              <div className="grid w-full grid-flow-row grid-cols-12  tab_view">
                <div onClick={() => { toggleBillingMenu(); setButtonCLicked('tab1') }} className={buttonCLicked === 'tab1' ? "clicked cursoer-pointer col-3 p-0 col-span-3 text-center" : 'col-3 p-0 cursor-pointer  col-span-3 text-center'}>
                  <div variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Dine In</div>
                </div>
                <div onClick={() => { toggleBillingMenu(); setButtonCLicked('tab2') }} className={buttonCLicked === 'tab2' ? "clicked cursoer-pointer col-3 p-0  col-span-3 text-center" : 'col-3 p-0 cursor-pointer  col-span-3 text-center'}>
                  <div variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Delivery</div>
                </div>
                <div onClick={() => { toggleBillingMenu(); setButtonCLicked('tab3') }} className={buttonCLicked === 'tab3' ? "clicked cursoer-pointer col-3 p-0  col-span-3 text-center" : 'col-3 p-0 cursor-pointer  col-span-3 text-center'}>
                  <div variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Pick Up</div>
                </div>
                <div onClick={() => { toggleBillingMenu(); setButtonCLicked('tab4') }} className={buttonCLicked === 'tab4' ? "clicked cursoer-pointer col-3 p-0  col-span-3 text-center" : "col-3 p-0 cursor-pointer  col-span-3 text-center"}>
                  <div variant='plain' color='danger' className="w-100 col-auto text-center p-2 px-0">Hotel</div>
                </div>
              </div>
            </div>
            <div className="bill_tag_12 ">
              {buttonCLicked === 'tab1' && billineMenu === true && (
                <div>
                  <div className="flex">
                    <div className="billing_icon px-6 py-3 border-2 b text-2xl cursor-pointer" onClick={() => {
                      setDineInCustomerDetails(!dineInCustomerDetails)
                      if (dineInOrderComment) {
                        setDineInOrderComment(false)
                      }
                    }}>
                      <BsPerson />
                    </div>
                    <div className="billing_icon px-6 py-3 border-2 border-l-0 cursor-pointer text-2xl" onClick={() => {
                      setDineInOrderComment(!dineInOrderComment)
                      if (dineInCustomerDetails) {
                        setDineInCustomerDetails(false)
                      }
                    }}>
                      <TbFilePencil />
                    </div>
                  </div>
                  {dineInCustomerDetails && (
                    <div className="w-full text-base table_no">
                      <div className="border-t-2 px-2 ">
                        <table className="my-1 h-44 w-full">
                          <tbody>
                            <tr className='mb-1'>
                              <td className="w-5">Mobile&nbsp;</td>
                              <td><input onChange={(e) => setDineInCustomerDetails({ ...dineInCustomerDetails, mobile: e.target.value })} required={buttonCLicked === 'tab1'} type="number" className="border-2 w-48 p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-1'>
                              <td className="w-5">Name&nbsp;</td>
                              <td><input onChange={(e) => setDineInCustomerDetails({ ...dineInCustomerDetails, name: e.target.value })} type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-1'>
                              <td className="w-5">Add&nbsp;</td>
                              <td>
                                {/* <input
                                  onChange={(e) => setDineInCustomerDetails({ ...dineInCustomerDetails, address: e.target.value })}
                                  type="text"
                                  className="border-2 w-full p-1 rounded-sm"
                                  name=""
                                  id=""
                                /> */}
                                <ReactTransliterate
                                  value={text}
                                  onChange={(e) => setDeliveryCustomerDetails({ ...dineInCustomerDetails, address: e.target.value })}
                                  className="border-2 w-full p-1 rounded-sm"
                                  onChangeText={(text) => {
                                    setText(text);
                                  }}
                                  lang="gu"
                                />
                              </td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Locality&nbsp;</td>
                              <td><input onChange={(e) => setDineInCustomerDetails({ ...dineInCustomerDetails, locality: e.target.value })} type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {dineInOrderComment && (
                    <div className="border-t-2 text-base px-2">
                      <div className="w-full px-2 my-2">
                        <span className="w-3">Order Comment&nbsp;</span> <input onChange={(e) => setDineInOrderComment(e.target.value)} type="text" name="" id="" className="w-80 p-1 border-2 rounded-sm" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {buttonCLicked === 'tab2' && billineMenu === true && (
                <div>
                  <div className="flex">
                    <div className="billing_icon px-6 py-3 border-2 b text-2xl cursor-pointer" onClick={() => {
                      setDeliveryCustomerDetails(!deliveryCustomerDetails)
                      if (deliveryOrderComment) {
                        setDeliveryOrderComment(false)
                      }
                    }}>
                      <BsPerson />
                    </div>
                    <div className="billing_icon px-6 py-3 border-2 border-l-0 cursor-pointer text-2xl" onClick={() => {
                      setDeliveryOrderComment(!deliveryOrderComment)
                      if (deliveryCustomerDetails) {
                        setDeliveryCustomerDetails(false)
                      }
                    }}>
                      <TbFilePencil />
                    </div>
                  </div>
                  {deliveryCustomerDetails && (
                    <div className="w-full text-base table_no">
                      <div className="border-t-2 p-2">
                        <table className="mx-2 h-44 w-full">
                          <tbody>
                            <tr className='mb-3'>
                              <td className="w-5">Mobile&nbsp;</td>
                              <td><input onChange={(e) => setDeliveryCustomerDetails({ ...deliveryCustomerDetails, mobile: e.target.value })} required={buttonCLicked === 'tab2'} type="number" className="border-2 w-48 p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Name&nbsp;</td>
                              <td><input onChange={(e) => setDeliveryCustomerDetails({ ...deliveryCustomerDetails, name: e.target.value })} type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Add&nbsp;</td>
                              <td>
                                {/* <input
                                  onChange={(e) => setDeliveryCustomerDetails({ ...deliveryCustomerDetails, address: e.target.value })}
                                  type="text"
                                  className="border-2 w-full p-1 rounded-sm"
                                /> */}
                                <ReactTransliterate
                                  value={text}
                                  onChange={(e) => setDeliveryCustomerDetails({ ...deliveryCustomerDetails, address: e.target.value })}
                                  className="border-2 w-full p-1 rounded-sm"
                                  onChangeText={(text) => {
                                    setText(text);
                                  }}
                                  lang="gu"
                                />
                              </td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Locality&nbsp;</td>
                              <td><input onChange={(e) => setDeliveryCustomerDetails({ ...deliveryCustomerDetails, locality: e.target.value })} type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {deliveryOrderComment && (
                    <div className="border-t-2 text-base">
                      <div className="w-full px-2 my-2">
                        <span className="w-3">Order Comment&nbsp;</span> <input onChange={(e) => setDeliveryOrderComment(e.target.value)} type="text" name="" id="" className="w-80 p-1 border-2 rounded-sm" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {buttonCLicked === 'tab3' && billineMenu === true && (
                <div>
                  <div className="flex">
                    <div className="billing_icon px-6 py-3 border-2 b text-2xl cursor-pointer" onClick={() => {
                      setPickUpCustomerDetails(!pickUpCustomerDetails)
                      if (pickUpOrderComment) {
                        setPickUpOrderComment(false)
                      }
                    }}>
                      <BsPerson />
                    </div>
                    <div className="billing_icon px-6 py-3 border-2 border-l-0 cursor-pointer text-2xl" onClick={() => {
                      setPickUpOrderComment(!pickUpOrderComment)
                      if (pickUpCustomerDetails) {
                        setPickUpCustomerDetails(false)
                      }
                    }}>
                      <TbFilePencil />
                    </div>
                  </div>
                  {pickUpCustomerDetails && (
                    <div className="w-full text-base table_no">
                      <div className="border-t-2 p-2">
                        <table className="mx-2 h-44 w-full">
                          <tbody >
                            <tr className='mb-3'>
                              <td className="w-5">Mobile&nbsp;</td>
                              <td><input onChange={(e) => setPickUpCustomerDetails({ ...pickUpCustomerDetails, mobile: e.target.value })} required={buttonCLicked === 'tab3'} type="number" className="border-2 w-48 p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Name&nbsp;</td>
                              <td><input onChange={(e) => setPickUpCustomerDetails({ ...pickUpCustomerDetails, name: e.target.value })} type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Add&nbsp;</td>
                              <td>
                                {/* <input
                                  onChange={(e) => setPickUpCustomerDetails({ ...pickUpCustomerDetails, address: e.target.value })}
                                  type="text"
                                  className="border-2 w-full p-1 rounded-sm"
                                  name=""
                                  id=""
                                /> */}
                                <ReactTransliterate
                                  value={text}
                                  onChange={(e) => setDeliveryCustomerDetails({ ...pickUpCustomerDetails, address: e.target.value })}
                                  className="border-2 w-full p-1 rounded-sm"
                                  onChangeText={(text) => {
                                    setText(text);
                                  }}
                                  lang="gu"
                                />
                              </td>
                            </tr>
                            <tr className='mb-3'>
                              <td className="w-5">Locality&nbsp;</td>
                              <td><input onChange={(e) => setPickUpCustomerDetails({ ...pickUpCustomerDetails, locality: e.target.value })} type="text" className="border-2 w-full p-1 rounded-sm" name="" id="" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {pickUpOrderComment && (
                    <div className="border-t-2 text-base p-2">
                      <div className="w-full  mx-2">
                        <span className="w-3">Order Comment&nbsp;</span> <input onChange={(e) => setPickUpOrderComment(e.target.value)} type="text" name="" id="" className="w-80 p-1 border-2 rounded-sm" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {buttonCLicked === 'tab4' && billineMenu === true && (
                <div>
                </div>
              )}

              <div className="mr-2 p-0 text-base">
                <div className="bg-gray-200">
                  <div className="grid grid-cols-12 p-2">
                    <div className="col-span-3 justify-self-center underline color-gray-700 pl-3">ITEMS</div>
                    <div className="col-span-3 justify-self-end">COMMENTS</div>
                    <div className="col-span-3 justify-self-center">QTY.</div>
                    <div className="col-span-3 justify-self-end pr-3">PRICE</div>
                  </div>
                </div>
                <div className="main_bill2 h-full">
                  {
                    items.length === 0 && (
                      <div className={`text-center mt-10 bill_tag ${noItemsDesign ? 'fixed_height' : 'mb-24'}`}>
                        <div>
                          <p className='text-lg text-gray-600'>No items Added</p>
                          <p>Please add the item First</p>
                          <IoIosRestaurant className='Billing_icon text-center ms-7' />
                        </div>
                      </div>

                    )
                  }
                  {items.map((item, index) => (
                    <div key={index} className="bg-amber-50 billin_content p-2 text-lg">
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
            </div>
          </div>
          <div className="w-full p-2 text-base tab_view text-white">
            <div className="flex w-full justify-around gap-4 main_div">
              <div>
                <button className='text-base button px-2 py-1 rounded-sm text-white'>Split</button>
              </div>
              <div>
                <div className="flex gap-2 text-base">
                  <div>
                    <input type="checkbox" name="" id="" />
                  </div>
                  <p>Complementary</p>
                </div>
              </div>
              <div>
                <div className="flex gap-2  main_div">
                  <div className='bg-red-600  p-1'>
                    <MdOutlineCurrencyExchange className='text-white text-xl' />
                  </div>
                  <p className='text-base'>Total:-</p>
                  <p className='text-base'>329</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <RadioGroup
              className='radio_buttons text-base'
            >
              <div>
                <FormControlLabel value="Cash" control={<Radio name='radio' />} label="Cash" />
              </div>
              <div>
                <FormControlLabel value="Due" control={<Radio name='radio' />} label="Due" />
              </div>
              <div>
                <FormControlLabel value="Other" control={<Radio name='radio' />} label="Other" />
              </div>
              <div>
                <FormControlLabel value="Complementary" control={<Radio name='radio' />} label="Complementary" />
              </div>
            </RadioGroup>
          </div>

          <div className="w-full flex text-base p-2 justify-center gap-4 bg-gray-500">
            <div><input type="checkbox" /></div>
            <div>It's Paid</div>
          </div>
          <div className="w-full flex justify-center gap-4 p-1 mt-1 ">
            <div>
              <button className='text-base button save_button py-1 rounded-md text-white'>Save</button>
            </div>
            <div>
              <button className='text-base button px-2 py-1 rounded-md text-white'>Print & Bill</button>
            </div>
            <div>
              <button className='another_1 button text-base px-2 py-1 rounded-md text-white'>KOT</button>
            </div>
            <div>
              <button className='another_1 button text-base px-2 py-1 rounded-md text-white'>KOT & PRINT</button>
            </div>
            <div>
              <button className='another_2 button text-base px-2 py-1 rounded-md text-white bg-transparent' >HOLD</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
export default PickUp1