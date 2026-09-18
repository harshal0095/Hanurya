"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="bg-primary min-h-screen pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">Contact Us</h1>
          <p className="text-dark/70 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our products, an order, or just want to say hello.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Contact Info */}
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-square bg-cream mb-8 overflow-hidden rounded-sm hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"
                alt="Hanurya Studio"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-serif text-dark mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-accent" /> Email
                </h3>
                <p className="text-dark/70 pl-8">ganganijinit@ymail.com</p>
              </div>
              
              <div>
                <h3 className="text-lg font-serif text-dark mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-accent" /> Phone
                </h3>
                <p className="text-dark/70 pl-8">+91 7574862119</p>
                <p className="text-dark/70 pl-8 text-sm mt-1">Mon-Fri, 9am-5pm EST</p>
              </div>
              
              <div>
                <h3 className="text-lg font-serif text-dark mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-accent" /> Studio
                </h3>
                <p className="text-dark/70 pl-8">AHMEDABAD, GUJRAT-382481</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-2/3 bg-white p-8 md:p-12 shadow-sm border border-dark/5">
            <h2 className="text-3xl font-serif text-dark mb-8">Send a Message</h2>
            
            {status === 'success' && (
              <div className="bg-accent/10 text-accent p-4 mb-8 text-center font-medium">
                Thank you for reaching out! We will get back to you within 24-48 hours.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark/70 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-primary border border-dark/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark/70 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-primary border border-dark/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-dark/70 mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-primary border border-dark/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="order">Question about an order</option>
                  <option value="product">Product question</option>
                  <option value="wholesale">Wholesale inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-dark/70 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-primary border border-dark/20 px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none"
                ></textarea>
              </div>
              
              <Button type="submit" size="lg" className="w-full uppercase tracking-widest text-sm" isLoading={status === 'loading'}>
                Submit Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
