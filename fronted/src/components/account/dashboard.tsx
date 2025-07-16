'use client'
import { faAddressBook, faArrowLeft, faCartShopping, faDoorOpen, faEdit, faQuestionCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';
import { WooCommerceCustomer } from '../../utils/types';
import Orders from './Orders';

const Dashboard = () => {
  const { user, token, logout } = useAuth(); // Auth context for user and token
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [userData, setUserData] = useState<WooCommerceCustomer | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<WooCommerceCustomer>>({});
  

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  // Extract the first user object from the user array safely
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const details = await user;
        if (details) {
          setUserData(details);
          setFormData(details);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, user]);

 

  // Handle resize to toggle mobile or desktop view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobileView(mobile);
      if (!mobile && !activeSection) {
        setActiveSection('personal-details');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);

  // Handle form changes for editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for saving edited data
  const handleSave = async () => {
    if (!token || !userData?.id) return;

    try {
      const response = await axios.put(
        `/api/auth/edit-customer/${userData.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setUserData(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  // Sections for rendering
  const sections: Record<string, React.JSX.Element> = {
    'personal-details': (
      <div className="personal-details-section">
        <h2>
          Personal Details 
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
          )}
        </h2>
        <div className="personal-details-content">
          {isEditing ? (
            <>
              <div className="personal-detail-item">
                <label>
                  First Name:
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || userData?.first_name || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="personal-detail-item">
                <label>
                  Last Name:
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || userData?.last_name || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="personal-detail-item">
                <label>
                  Email Address:
                  <input
                    type="email"
                    name="email"
                    value={formData.email || userData?.email || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="personal-detail-item">
                <label>
                  Phone Number:
                  <input
                    type="tel"
                    name="phone"
                    value={formData?.billing?.phone || userData?.billing.phone || ''}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="action-buttons">
                <button onClick={handleSave} className="save-button">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <ul>
                <li>
                  <label>Username</label> {userData?.username || ''}
                </li>
                <li>
                  <label>First Name</label> {userData?.first_name || ''}
                </li>
                <li>
                  <label>Last Name</label> {userData?.last_name || ''}
                </li>
                <li>
                  <label>Email</label> {userData?.email || ''}
                </li>
                {userData?.billing.phone && (<li>
                  <label>Phone</label> {userData?.billing?.phone || ''}
                </li>)}
                </ul>
            </>
          )}
        </div>
      </div>
    ),
    
    address: (
      <div className="address-section">
        <h2>
          Address Book <FontAwesomeIcon icon={faEdit} onClick={() => setIsEditing(true)}/>
        </h2>
        <div className="address-block">
          <h3>Billing Address</h3>
          {userData?.billing && Object.keys(userData.billing).some((key) => userData.billing[key as keyof typeof userData.billing]) ? (
            <div className="address-details">
              {isEditing ? (
                <>
                  <label>
                    First Name:
                    <input
                      type="text"
                      name="billing_first_name"
                      value={formData.billing?.first_name || userData.billing.first_name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            first_name: e.target.value,
                            last_name: formData.billing?.last_name || '',
                            company: formData.billing?.company || '',
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Last Name:
                    <input
                      type="text"
                      name="billing_last_name"
                      value={formData.billing?.last_name || userData.billing.last_name || ''}
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            billing: { 
                              ...formData.billing || {},
                              first_name: formData.billing?.first_name || '',
                              last_name: e.target.value,
                              company: formData.billing?.company || '',
                              address_1: formData.billing?.address_1 || '',
                              address_2: formData.billing?.address_2 || '',
                              city: formData.billing?.city || '',
                              postcode: formData.billing?.postcode || '',
                              country: formData.billing?.country || '',
                              state: formData.billing?.state || '',
                              email: formData.billing?.email || '',
                              phone: formData.billing?.phone || ''
                            },
                          })
                        }
                    />
                  </label>
                  <label>
                    Company:
                    <input
                      type="text"
                      name="billing_company"
                      value={formData.billing?.company || userData.billing.company || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Address 1:
                    <input
                      type="text"
                      name="billing_address_1"
                      value={formData.billing?.address_1 || userData.billing.address_1 || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Address 2:
                    <input
                      type="text"
                      name="billing_address_2"
                      value={formData.billing?.address_2 || userData.billing.address_2 || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    City:
                    <input
                      type="text"
                      name="billing_city"
                      value={formData.billing?.city || userData.billing.city || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Postal Code:
                    <input
                      type="text"
                      name="billing_postal_code"
                      value={formData.billing?.postcode || userData.billing.postcode || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Country:
                    <input
                      type="text"
                      name="billing_country"
                      value={formData.billing?.country || userData.billing.country || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    State:
                    <input
                      type="text"
                      name="billing_state"
                      value={formData.billing?.state || userData.billing.state || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Phone:
                    <input
                      type="text"
                      name="billing_phone"
                      value={formData.billing?.phone || userData.billing.phone || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="text"
                      name="billing_last_name"
                      value={formData.billing?.email || userData.billing.email || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          billing: { 
                            ...formData.billing || {},
                            first_name: formData.billing?.first_name || '',
                            last_name: formData.billing?.last_name || '',
                            company: e.target.value,
                            address_1: formData.billing?.address_1 || '',
                            address_2: formData.billing?.address_2 || '',
                            city: formData.billing?.city || '',
                            postcode: formData.billing?.postcode || '',
                            country: formData.billing?.country || '',
                            state: formData.billing?.state || '',
                            email: formData.billing?.email || '',
                            phone: formData.billing?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <button onClick={handleSave} className="save-button">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">
                    Cancel
                  </button>
                </>
              ) : (
                <ul>
                   <li>
        <label>First Name</label> {user?.billing.first_name || ''}
        </li>
        <li>
        <label>Last Name</label> {user?.billing.last_name || ''}
        </li>
        <li>
        <label>Company</label> {user?.billing.company || ''}
        </li>
        <li>
        <label>Address 1</label> {user?.billing.address_1 || ''}
        </li>
        <li>
          <label>Address 2</label> {user?.billing.address_2 || ''}
        </li>
        <li>
        <label>City</label> {user?.billing.city || ''}
        </li>
        <li>
        <label>Post Code</label> {user?.billing.postcode|| ''}
        </li>
        <li>
        <label>Country</label> {user?.billing.country || ''}
        </li>
        <li>
        <label>State</label> {user?.billing.state || ''}
        </li>
        <li>
        <label>Email</label> {user?.billing.email || ''}
        </li>
        <li>
        <label>Phone</label> {user?.billing.phone || ''}
        </li>
                </ul>
              )}
            </div>
          ) : (
            <div>
              <button className='add_address-btn' onClick={() => setIsEditing(true)}>Add Billing Address</button>
            </div>
          )}
        </div>
        <div className="address-block">
          <h3>Shipping Address</h3>
          {userData?.shipping && Object.keys(userData.shipping).some((key) => userData.shipping[key as keyof typeof userData.shipping]) ? (
            <div className="address-details">
              {isEditing ? (
                <>
                  <label>
                    First Name:
                    <input
                      type="text"
                      name="shipping_first_name"
                      value={formData.shipping?.first_name || userData.shipping.first_name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Last Name:
                    <input
                      type="text"
                      name="shipping_last_name"
                      value={formData.shipping?.last_name || userData.shipping.last_name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Company:
                    <input
                      type="text"
                      name="shipping_company"
                      value={formData.shipping?.company || userData.shipping.company || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Address 1:
                    <input
                      type="text"
                      name="shipping_address_1"
                      value={formData.shipping?.address_1 || userData.shipping.address_1 || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Address 2:
                    <input
                      type="text"
                      name="shipping_address_2"
                      value={formData.shipping?.address_2 || userData.shipping.address_2 || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    City:
                    <input
                      type="text"
                      name="shipping_city"
                      value={formData.shipping?.city || userData.shipping.city || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Postal Code:
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={formData.shipping?.postcode || userData.shipping.postcode || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Country:
                    <input
                      type="text"
                      name="shipping_country"
                      value={formData.shipping?.country || userData.shipping.country || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    State:
                    <input
                      type="text"
                      name="shipping_state"
                      value={formData.shipping?.state || userData.shipping.state || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Phone:
                    <input
                      type="text"
                      name="shipping_phone"
                      value={formData.shipping?.phone || userData.shipping.phone || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="text"
                      name="shipping_last_name"
                      value={formData.shipping?.email || userData.shipping.email || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shipping: {
                            first_name: e.target.value,
                            last_name: formData.shipping?.last_name || '',
                            company: formData.shipping?.company || '',
                            address_1: formData.shipping?.address_1 || '',
                            address_2: formData.shipping?.address_2 || '',
                            city: formData.shipping?.city || '',
                            postcode: formData.shipping?.postcode || '',
                            country: formData.shipping?.country || '',
                            state: formData.shipping?.state || '',
                            email: formData.shipping?.email || '',
                            phone: formData.shipping?.phone || ''
                          },
                        })
                      }
                    />
                  </label>
                  <button onClick={handleSave} className="save-button">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">
                    Cancel
                  </button>
                </>
              ) : (
                <ul>
                  <li>
        <label>First Name</label> {user?.shipping.first_name || ''}
        </li>
        <li>
        <label>Last Name</label> {user?.shipping.last_name || ''}
        </li>
        <li>
        <label>Company</label> {user?.shipping.company || ''}
        </li>
        <li>
        <label>Address 1</label> {user?.shipping.address_1 || ''}
        </li>
        <li>
          <label>Address 2</label> {user?.shipping.address_2 || ''}
        </li>
        <li>
        <label>City</label> {user?.shipping.city || ''}
        </li>
        <li>
        <label>Post Code</label> {user?.shipping.postcode|| ''}
        </li>
        <li>
        <label>Country</label> {user?.shipping.country || ''}
        </li>
        <li>
        <label>State</label> {user?.shipping.state || ''}
        </li>
        <li>
        <label>Email</label> {user?.shipping.email || ''}
        </li>
        <li>
        <label>Phone</label> {user?.shipping.phone || ''}
        </li>
                </ul>
              )}
            </div>
          ) : (
            <div>
              <button className='add_address-btn' onClick={() => setIsEditing(true)}>Add Shipping Address</button>
            </div>
          )}
        </div>
      </div>
    ),
    
    
    orders: (
      <Orders user_id={userData?.id} token={token}/>
    ),
    support: <div className='support-section'>
      
      <h2>Support</h2>
      <div className='support-content'>
        <p><span>Email us on</span> Contact@cuvvahairfibers.com</p>
        <p>OR</p>
        <p>Click <Link href='/contact'>here</Link> for your enquiry.</p>
      </div>
      </div>,
  };

  return (
    <motion.main 
      className="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      <div className="dashboard-container">
        <AnimatePresence mode="wait">
          {(!isMobileView || !activeSection) && (
            <motion.aside 
              className="sidebar"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              <ul>
                {/* Your sidebar items with animation */}
                <motion.li 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection('personal-details')}
                >
                  Personal Details <FontAwesomeIcon icon={faUserCircle} className="sidebar-icon" />
                </motion.li>
                <motion.li onClick={() => setActiveSection('address')}>
                Address Book <FontAwesomeIcon icon={faAddressBook} className='sidebar-icon'/>
              </motion.li>
              <motion.li onClick={() => setActiveSection('orders')}>
                Orders <FontAwesomeIcon icon={faCartShopping} className='sidebar-icon'/>
              </motion.li>
              <motion.li onClick={() => setActiveSection('support')}>
                Support <FontAwesomeIcon icon={faQuestionCircle} className='sidebar-icon'/> 
              </motion.li>
              <motion.li onClick={logout}>
                Logout <FontAwesomeIcon icon={faDoorOpen} className='sidebar-icon'/>
              </motion.li>
              </ul>
            </motion.aside>
          )}
        </AnimatePresence>

        {isMobileView && activeSection && (
          <motion.button 
            className="back-button"
            onClick={() => setActiveSection(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {(!isMobileView || activeSection) && (
            <motion.section 
              className="content"
              key={activeSection}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              {sections[activeSection || 'personal-details'] || <h2>Select a section</h2>}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
};

export default Dashboard;