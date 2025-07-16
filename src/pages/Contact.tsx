import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, Instagram, Linkedin } from 'lucide-react';

const Contact = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    date: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add current date and time to form data
      const currentDate = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'Asia/Kolkata' // Indian timezone
      });

      // Get the form element
      const form = e.target as HTMLFormElement;
      
      // Add date to the form before submission
      const dateInput = document.createElement('input');
      dateInput.type = 'hidden';
      dateInput.name = 'Submission Date';
      dateInput.value = currentDate;
      form.appendChild(dateInput);

      // Add honeypot field to prevent spam
      const honeypotInput = document.createElement('input');
      honeypotInput.type = 'text';
      honeypotInput.name = '_honey';
      honeypotInput.style.display = 'none';
      form.appendChild(honeypotInput);
      
      // Submit the form
      form.submit();
      
      // Reset form and show success message
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', date: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-theme-blue dark:bg-theme-blue text-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Contact Us</h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Have questions, submissions, or ideas? We'd love to hear from you!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 px-6 md:px-12 bg-white dark:bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left Column - Get In Touch */}
              <div>
                <h2 className="text-4xl font-bold mb-8 text-theme-blue dark:text-white">Get In Touch</h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="bg-secondary/20 p-3 rounded-lg mr-4">
                      <Mail className="h-6 w-6 text-theme-blue dark:text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 text-theme-blue dark:text-white">Email Us</h3>
                      <p className="text-gray-800 dark:text-gray-200">thecompendiumiare@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-secondary/20 p-3 rounded-lg mr-4">
                      <Instagram className="h-6 w-6 text-theme-blue dark:text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 text-theme-blue dark:text-white">Follow Us</h3>
                      <a 
                        href="https://instagram.com/thecompendium.iare" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-800 dark:text-gray-200 hover:text-theme-blue dark:hover:text-white transition-colors"
                      >
                        @thecompendium.iare
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-secondary/20 p-3 rounded-lg mr-4">
                      <Linkedin className="h-6 w-6 text-theme-blue dark:text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 text-theme-blue dark:text-white">Connect With Us</h3>
                      <a 
                        href="https://www.linkedin.com/in/the-compendium-iare-987b35212/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-800 dark:text-gray-200 hover:text-theme-blue dark:hover:text-white transition-colors"
                      >
                        @the-compendium-iare
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Send a Message */}
              <div>
                <h2 className="text-4xl font-bold mb-8 text-theme-blue dark:text-white">Send a message</h2>
                
                {submitted && (
                  <div className="mb-6 p-4 text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-md">
                    Thank you for your message! We will get back to you soon.
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100 shadow-lg rounded-lg p-8 dark:bg-gradient-to-br dark:from-blue-950 dark:to-blue-900 dark:shadow-lg dark:border dark:border-white/10">
                  <form 
                    action="https://formsubmit.co/thecompendiumiare@gmail.com" 
                    method="POST" 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="flex flex-col space-y-6">
                      <label className="flex flex-col space-y-2">
                        <span className="text-gray-700 dark:text-white font-medium">Name</span>
                        <input 
                          type="text" 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name" 
                          className="px-4 py-3 bg-blue-50 border border-blue-200 shadow-sm rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-blue focus:border-theme-blue transition dark:bg-blue-950/60 dark:border-white/20 dark:text-white dark:placeholder-white/40 dark:focus:ring-white/20 dark:shadow-md dark:backdrop-blur-sm"
                          required
                        />
                      </label>
                      
                      <label className="flex flex-col space-y-2">
                        <span className="text-gray-700 dark:text-white font-medium">Email</span>
                        <input 
                          type="email" 
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com" 
                          className="px-4 py-3 bg-blue-50 border border-blue-200 shadow-sm rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-blue focus:border-theme-blue transition dark:bg-blue-950/60 dark:border-white/20 dark:text-white dark:placeholder-white/40 dark:focus:ring-white/20 dark:shadow-md dark:backdrop-blur-sm"
                          required
                        />
                      </label>
                      
                      <label className="flex flex-col space-y-2">
                        <span className="text-gray-700 dark:text-white font-medium">Message</span>
                        <textarea 
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6} 
                          placeholder="Your message" 
                          className="px-4 py-3 bg-blue-50 border border-blue-200 shadow-sm rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-blue focus:border-theme-blue transition resize-none dark:bg-blue-950/60 dark:border-white/20 dark:text-white dark:placeholder-white/40 dark:focus:ring-white/20 dark:shadow-md dark:backdrop-blur-sm"
                          required
                        ></textarea>
                      </label>
                      
                      {/* Hidden fields for FormSubmit */}
                      <input type="hidden" name="_subject" value="New Contact Form Submission" />
                      <input type="hidden" name="_template" value="table" />
                      <input type="hidden" name="_next" value="https://thecompendiumclub.com/contact" />
                      <input type="hidden" name="_captcha" value="true" />
                      <input type="hidden" name="_autoresponse" value="Thank you for contacting us! We have received your message and will get back to you soon." />

                      <button 
                        type="submit" 
                        className="w-full px-6 py-3.5 bg-theme-blue hover:bg-theme-blue/90 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-theme-blue/10 focus:outline-none focus:ring-2 focus:ring-theme-blue dark:bg-slate-700 dark:text-theme-blue dark:hover:bg-slate-600 dark:focus:ring-white/20 dark:bg-yellow-400 dark:hover:bg-yellow-300"
                      >
                        Send Message
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 transform transition-transform group-hover:translate-x-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M14 5l7 7m0 0l-7 7m7-7H3" 
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
