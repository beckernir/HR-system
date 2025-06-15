"use client"
import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import {useRouter} from 'next/navigation';
interface FormData {
  fullName: string;
  gender: string;
  age: string;
  mobilePhone: string;
  email: string;
  nationalId: string;
  qualifications: string;
  belief: string;
  disabilities: string;
  maritalStatus: string;
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export default function JobApplicationForm() {
  const route = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    gender: '',
    age: '',
    mobilePhone: '',
    email: '',
    nationalId: '',
    qualifications: '',
    belief: '',
    disabilities: '',
    maritalStatus: '',
  });

  const handleInputChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div className="flex items-start space-x-4 mb-4 md:mb-0">
          <div className="bg-blue-100 rounded-full p-2">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-800 flex items-center justify-center">
              <img 
                src="/api/placeholder/50/50" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Job Application</h1>
            <div className="text-lg font-semibold">Senior Project Analyst</div>
            <div className="text-gray-600">Department: Management</div>
            <div className="text-gray-500 text-sm">2 days ago</div>
          </div>
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:items-end">
          <div className="mr-4">
            <div className="text-gray-700 text-sm">Experience: <span className="font-medium">5 years Min</span></div>
            <div className="text-gray-700 text-sm">Location: <span className="font-medium">Expat</span></div>
            <div className="text-gray-700 text-sm">Expiry Date: <span className="text-green-600 font-medium">April 28, 2025</span></div>
          </div>
          <button className="bg-black text-white rounded-full px-6 py-2 text-sm flex items-center justify-center" onClick={()=>{route.push("/lecturer-dashboard/job-listing")}}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Jobs
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div>
        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            Personal Informations <span className="text-red-500">(*</span> required)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Enter Fullnames"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <select
                name="gender"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="" disabled>Choose Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <input
                type="number"
                name="age"
                placeholder="Enter Age"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <input
                type="tel"
                name="mobilePhone"
                placeholder="Enter Mobile Phone"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.mobilePhone}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter E-mail Address"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <input
                type="text"
                name="nationalId"
                placeholder="Enter National / Passport ID"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nationalId}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <select
                name="qualifications"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={formData.qualifications}
                onChange={handleInputChange}
              >
                <option value="" disabled>Choose Qualifications</option>
                <option value="highSchool">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            
            <div>
              <select
                name="belief"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={formData.belief}
                onChange={handleInputChange}
              >
                <option value="" disabled>Choose Belief</option>
                <option value="religious">Religious</option>
                <option value="nonReligious">Non-Religious</option>
                <option value="preferNotToSay">Prefer Not to Say</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                name="disabilities"
                placeholder="Disabilities"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.disabilities}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <input
                type="text"
                name="maritalStatus"
                placeholder="Marital Status"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.maritalStatus}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        {/* Files Upload */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Files Upload</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add NID/Passport Image"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <button type="button" className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm">
                Choose file...
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add Education Qualifications file"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <button type="button" className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm">
                Choose file...
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add Criminal Record file"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <button type="button" className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm">
                Choose file...
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add Visa Work Permit (if any)"
                className="w-full py-3 px-4 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
              <button type="button" className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 text-sm">
                Choose file...
              </button>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-800 text-white py-3 px-8 rounded-md font-medium hover:bg-blue-900 transition-colors"
          >
            Apply to this job
          </button>
        </div>
      </div>
    </div>
  );
}