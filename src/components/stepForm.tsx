// import React, { useState } from "react";

// // Backend Enums - These should match your backend enum definitions
// const ENUMS = {
//   GENDER: {
//     MALE: "MALE",
//     FEMALE: "FEMALE",
//     OTHER: "OTHER",
//   },
//   RELIGION: {
//     CHRISTIAN: "CHRISTIAN",
//     MUSLIM: "MUSLIM",
//     HINDU: "HINDU",
//     BUDDHIST: "BUDDHIST",
//     JEWISH: "JEWISH",
//     OTHER: "OTHER",
//     NONE: "NONE",
//   },
//   ACADEMIC_RANK: {
//     BACHELOR: "BACHELOR",
//     MASTER: "MASTER",
//     PHD: "PHD",
//     OTHER: "OTHER",
//   },
//   MARITAL_STATUS: {
//     SINGLE: "SINGLE",
//     MARRIED: "MARRIED",
//     DIVORCED: "DIVORCED",
//     WIDOWED: "WIDOWED",
//   },
//   CONTRACT_TYPE: {
//     PERMANENT: "PERMANENT",
//     TEMPORARY: "TEMPORARY",
//     CONTRACT: "CONTRACT",
//     PART_TIME: "PART_TIME",
//   },
//   TPR_LEVEL: {
//     LEVEL1: "LEVEL1",
//     LEVEL2: "LEVEL2",
//     LEVEL3: "LEVEL3",
//   },
//   USER_ROLE: {
//     LECTURER: "LECTURER",
//     EMPLOYEE: "EMPLOYEE",
//     ADMIN: "ADMIN",
//   },
// };

// // Helper function to get enum options for dropdowns
// const getEnumOptions = (enumObj: Record<string, string>) => {
//   return Object.entries(enumObj).map(([key, value]) => ({
//     value,
//     label: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, " "),
//   }));
// };

// // Type definitions
// interface FormData {
//   fullNames: string;
//   gender: string;
//   dateOfBirth: string;
//   phoneNumber: string;
//   email: string;
//   nationalId: string;
//   nationality: string;
//   religion: string;
//   academicRank: string;
//   maritalStatus: string;
//   contractType: string;
//   workingPosition: string;
//   bankAccount: string;
//   accountNumber: string;
//   salary: string;
//   tprLevel: string;
//   rssbNumber: string;
//   totalAllowances: string;
//   role: string;
// }

// interface FormErrors {
//   [key: string]: string;
// }

// const StepForm = () => {
//   const [step, setStep] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [successMessage, setSuccessMessage] = useState<string>("");

//   // Form data state
//   const [formData, setFormData] = useState<FormData>({
//     fullNames: "",
//     gender: "",
//     dateOfBirth: "",
//     phoneNumber: "",
//     email: "",
//     nationalId: "",
//     nationality: "",
//     religion: "",
//     academicRank: "",
//     maritalStatus: "",
//     contractType: "",
//     workingPosition: "",
//     bankAccount: "",
//     accountNumber: "",
//     salary: "",
//     tprLevel: "",
//     rssbNumber: "",
//     totalAllowances: "",
//     role: ENUMS.USER_ROLE.LECTURER, // Default role using enum
//   });

//   // Handle input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // Validation functions
//   const validateStep1 = (): FormErrors => {
//     const stepErrors: FormErrors = {};

//     if (!formData.fullNames.trim())
//       stepErrors.fullNames = "Full name is required";
//     if (!formData.gender) stepErrors.gender = "Gender is required";
//     if (!formData.dateOfBirth)
//       stepErrors.dateOfBirth = "Date of birth is required";
//     if (!formData.phoneNumber.trim())
//       stepErrors.phoneNumber = "Phone number is required";
//     if (!formData.email.trim()) stepErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       stepErrors.email = "Invalid email format";
//     if (!formData.nationalId.trim())
//       stepErrors.nationalId = "National ID is required";
//     if (!formData.nationality.trim())
//       stepErrors.nationality = "Nationality is required";
//     if (!formData.contractType)
//       stepErrors.contractType = "Contract type is required";

//     return stepErrors;
//   };

//   const validateStep3 = (): FormErrors => {
//     const stepErrors: FormErrors = {};

//     if (!formData.workingPosition.trim())
//       stepErrors.workingPosition = "Working position is required";
//     if (!formData.salary || parseFloat(formData.salary) <= 0)
//       stepErrors.salary = "Valid salary is required";

//     return stepErrors;
//   };

//   // Navigation functions
//   const nextStep = () => {
//     let stepErrors: FormErrors = {};

//     if (step === 1) {
//       stepErrors = validateStep1();
//     } else if (step === 3) {
//       stepErrors = validateStep3();
//     }

//     if (Object.keys(stepErrors).length > 0) {
//       setErrors(stepErrors);
//       return;
//     }

//     setErrors({});
//     setStep((prev) => Math.min(prev + 1, 3));
//   };

//   const prevStep = () => {
//     setStep((prev) => Math.max(prev - 1, 1));
//     setErrors({});
//   };

//   // Calculate take home salary
//   const calculateTakeHomeSalary = (): string => {
//     const salary = parseFloat(formData.salary) || 0;
//     const allowances = parseFloat(formData.totalAllowances) || 0;
//     const total = salary + allowances;

//     // Simple tax calculation (you might need to adjust this based on your business logic)
//     const tax = total * 0.15; // Assuming 15% tax
//     const takeHome = total - tax;

//     return takeHome.toLocaleString("en-RW", {
//       style: "currency",
//       currency: "RWF",
//       minimumFractionDigits: 0,
//     });
//   };

//   // Submit form to API
//   const handleSubmit = async () => {
//     const stepErrors = validateStep3();
//     if (Object.keys(stepErrors).length > 0) {
//       setErrors(stepErrors);
//       return;
//     }

//     setLoading(true);
//     setErrors({});

//     try {
//       // Prepare data for API
//       const apiData = {
//         fullNames: formData.fullNames,
//         phoneNumber: formData.phoneNumber,
//         dateOfBirth: formData.dateOfBirth,
//         gender: formData.gender,
//         academicRank: formData.academicRank || null,
//         email: formData.email,
//         nationalId: formData.nationalId,
//         nationality: formData.nationality,
//         contractType: formData.contractType,
//         maritalStatus: formData.maritalStatus || null,
//         religion: formData.religion || null,
//         workingPosition: formData.workingPosition,
//         salary: parseFloat(formData.salary),
//         totalAllowances: parseFloat(formData.totalAllowances) || 0,
//         bankAccount: formData.bankAccount || null,
//         accountNumber: formData.accountNumber || null,
//         tprLevel: formData.tprLevel || null,
//         rssbNumber: formData.rssbNumber || null,
//         role: formData.role,
//       };

//       const response = await fetch("http://localhost:9005/api/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(apiData),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setSuccessMessage("User created successfully!");
//         // Reset form
//         setTimeout(() => {
//           setFormData({
//             fullNames: "",
//             gender: "",
//             dateOfBirth: "",
//             phoneNumber: "",
//             email: "",
//             nationalId: "",
//             nationality: "",
//             religion: "",
//             academicRank: "",
//             maritalStatus: "",
//             contractType: "",
//             workingPosition: "",
//             bankAccount: "",
//             accountNumber: "",
//             salary: "",
//             tprLevel: "",
//             rssbNumber: "",
//             totalAllowances: "",
//             role: ENUMS.USER_ROLE.EMPLOYEE,
//           });
//           setStep(1);
//           setSuccessMessage("");
//         }, 3000);
//       } else {
//         setErrors({ submit: result.message || "Failed to create user" });
//       }
//     } catch (error) {
//       console.error("Error creating user:", error);
//       setErrors({ submit: "Network error. Please try again." });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 w-full mx-auto max-w-6xl">
//       {/* Success Message */}
//       {successMessage && (
//         <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//           {successMessage}
//         </div>
//       )}

//       {/* Error Message */}
//       {errors.submit && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {errors.submit}
//         </div>
//       )}

//       <div className="flex space-x-2 bg-[#31408A96] mb-6 rounded-xl">
//         {["Workers Dash", "Workers Performance", "Workers Attendance"].map(
//           (tab, idx) => (
//             <div
//               key={idx}
//               className={`flex-1 text-center p-4 rounded-xl text-white cursor-pointer ${
//                 step === idx + 1 ? "bg-[#31408A]" : ""
//               }`}
//             >
//               {tab}
//             </div>
//           )
//         )}
//       </div>

//       <h2 className="text-center text-xl font-bold text-blue-900 mb-4">
//         Workers Management ({step}/3)
//       </h2>

//       {step === 1 && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <input
//               name="fullNames"
//               value={formData.fullNames}
//               onChange={handleInputChange}
//               placeholder="Enter Fullnames"
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.fullNames ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.fullNames && (
//               <p className="text-red-500 text-sm mt-1">{errors.fullNames}</p>
//             )}
//           </div>

//           <div>
//             <select
//               name="gender"
//               value={formData.gender}
//               onChange={handleInputChange}
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.gender ? "border-2 border-red-500" : ""
//               }`}
//             >
//               <option value="">Choose Gender</option>
//               {getEnumOptions(ENUMS.GENDER).map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.gender && (
//               <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
//             )}
//           </div>

//           <div>
//             <input
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleInputChange}
//               placeholder="Enter Mobile Phone"
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.phoneNumber ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.phoneNumber && (
//               <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
//             )}
//           </div>

//           <div>
//             <input
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Enter E-mail Address"
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.email ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           <div>
//             <input
//               name="nationalId"
//               value={formData.nationalId}
//               onChange={handleInputChange}
//               placeholder="Enter National / Passport ID"
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.nationalId ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.nationalId && (
//               <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>
//             )}
//           </div>

//           <div>
//             <input
//               name="dateOfBirth"
//               type="date"
//               value={formData.dateOfBirth}
//               onChange={handleInputChange}
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.dateOfBirth ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.dateOfBirth && (
//               <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
//             )}
//           </div>

//           <div>
//             <select
//               name="religion"
//               value={formData.religion}
//               onChange={handleInputChange}
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             >
//               <option value="">Choose Religion</option>
//               {getEnumOptions(ENUMS.RELIGION).map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <input
//               name="nationality"
//               value={formData.nationality}
//               onChange={handleInputChange}
//               placeholder="Nationality"
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.nationality ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.nationality && (
//               <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
//             )}
//           </div>

//           <div>
//             <select
//               name="academicRank"
//               value={formData.academicRank}
//               onChange={handleInputChange}
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             >
//               <option value="">Choose Academic Rank</option>
//               {getEnumOptions(ENUMS.ACADEMIC_RANK).map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <select
//               name="maritalStatus"
//               value={formData.maritalStatus}
//               onChange={handleInputChange}
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             >
//               <option value="">Marital Status</option>
//               {getEnumOptions(ENUMS.MARITAL_STATUS).map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <select
//               name="contractType"
//               value={formData.contractType}
//               onChange={handleInputChange}
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.contractType ? "border-2 border-red-500" : ""
//               }`}
//             >
//               <option value="">Type of Contract</option>
//               {getEnumOptions(ENUMS.CONTRACT_TYPE).map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.contractType && (
//               <p className="text-red-500 text-sm mt-1">{errors.contractType}</p>
//             )}
//           </div>
//         </div>
//       )}

//       {step === 2 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="flex items-center">
//             <input
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px] flex-1"
//               placeholder="Passport Size Photo"
//               disabled
//             />
//             <button className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
//               Choose file
//             </button>
//           </div>
//           <div className="flex items-center">
//             <input
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px] flex-1"
//               placeholder="Academic Qualifications"
//               disabled
//             />
//             <button className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
//               Choose file
//             </button>
//           </div>
//           <div className="flex items-center">
//             <input
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px] flex-1"
//               placeholder="Police (Criminal) Clearance"
//               disabled
//             />
//             <button className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
//               Choose file
//             </button>
//           </div>
//         </div>
//       )}

//       {step === 3 && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div>
//             <input
//               name="workingPosition"
//               value={formData.workingPosition}
//               onChange={handleInputChange}
//               placeholder="Choose Working Position"
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.workingPosition ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.workingPosition && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.workingPosition}
//               </p>
//             )}
//           </div>

//           <div>
//             <input
//               name="bankAccount"
//               value={formData.bankAccount}
//               onChange={handleInputChange}
//               placeholder="Choose Bank for payment"
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             />
//           </div>

//           <div>
//             <input
//               name="accountNumber"
//               value={formData.accountNumber}
//               onChange={handleInputChange}
//               placeholder="Enter Account Number"
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             />
//           </div>

//           <div>
//             <input
//               name="salary"
//               type="number"
//               value={formData.salary}
//               onChange={handleInputChange}
//               placeholder="Enter Salary Amount"
//               className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
//                 errors.salary ? "border-2 border-red-500" : ""
//               }`}
//             />
//             {errors.salary && (
//               <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
//             )}
//           </div>

//           <div>
//             <select
//               name="tprLevel"
//               value={formData.tprLevel}
//               onChange={handleInputChange}
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             >
//               <option value="">Choose TPR Level</option>
//               {getEnumOptions(ENUMS.TPR_LEVEL).map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <input
//               name="rssbNumber"
//               value={formData.rssbNumber}
//               onChange={handleInputChange}
//               placeholder="Enter RSSB Number"
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             />
//           </div>

//           <div>
//             <input
//               name="totalAllowances"
//               type="number"
//               value={formData.totalAllowances}
//               onChange={handleInputChange}
//               placeholder="Total Allowances (if any)"
//               className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
//             />
//           </div>

//           <div className="sm:col-span-3">
//             <div className="text-blue-900 font-medium border border-blue-500 rounded-md p-2 w-full">
//               Take Home Salary: {calculateTakeHomeSalary()}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between mt-6">
//         {step > 1 ? (
//           <button
//             onClick={prevStep}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             disabled={loading}
//           >
//             Back
//           </button>
//         ) : (
//           <div />
//         )}
//         {step < 3 ? (
//           <button
//             onClick={nextStep}
//             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             disabled={loading}
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save Employee"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StepForm;


import React, { useState } from "react";
import { Plus, X } from 'lucide-react';

// Backend Enums - These should match your backend enum definitions
const ENUMS = {
  GENDER: {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER",
  },
  RELIGION: {
    CHRISTIAN: "CHRISTIAN",
    MUSLIM: "MUSLIM",
    HINDU: "HINDU",
    BUDDHIST: "BUDDHIST",
    JEWISH: "JEWISH",
    OTHER: "OTHER",
    NONE: "NONE",
  },
  ACADEMIC_RANK: {
    BACHELOR: "BACHELOR",
    MASTER: "MASTER",
    PHD: "PHD",
    OTHER: "OTHER",
  },
  MARITAL_STATUS: {
    SINGLE: "SINGLE",
    MARRIED: "MARRIED",
    DIVORCED: "DIVORCED",
    WIDOWED: "WIDOWED",
  },
  CONTRACT_TYPE: {
    PERMANENT: "PERMANENT",
    TEMPORARY: "TEMPORARY",
    CONTRACT: "CONTRACT",
    PART_TIME: "PART_TIME",
  },
  TPR_LEVEL: {
    LEVEL1: "LEVEL1",
    LEVEL2: "LEVEL2",
    LEVEL3: "LEVEL3",
  },
  USER_ROLE: {
    LECTURER: "LECTURER",
    EMPLOYEE: "EMPLOYEE",
    ADMIN: "ADMIN",
  },
};

// Helper function to get enum options for dropdowns
const getEnumOptions = (enumObj: Record<string, string>) => {
  return Object.entries(enumObj).map(([key, value]) => ({
    value,
    label: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, " "),
  }));
};

// Type definitions
interface FormData {
  fullNames: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  nationality: string;
  religion: string;
  academicRank: string;
  maritalStatus: string;
  contractType: string;
  workingPosition: string;
  bankAccount: string;
  accountNumber: string;
  salary: string;
  tprLevel: string;
  rssbNumber: string;
  totalAllowances: string;
  role: string;
}

interface WorkExperience {
  company: string;
  position: string;
  year: string;
  experience: string;
  logo: string;
}

interface Education {
  institution: string;
  department: string;
  program: string;
  period: string;
  logo: string;
}

interface FormErrors {
  [key: string]: string;
}

const StepForm = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    fullNames: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    nationalId: "",
    nationality: "",
    religion: "",
    academicRank: "",
    maritalStatus: "",
    contractType: "",
    workingPosition: "",
    bankAccount: "",
    accountNumber: "",
    salary: "",
    tprLevel: "",
    rssbNumber: "",
    totalAllowances: "",
    role: ENUMS.USER_ROLE.LECTURER, // Default role using enum
  });

  // New state for education and work experience
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    { company: '', position: '', year: '', experience: '', logo: '' }
  ]);
  
  const [education, setEducation] = useState<Education[]>([
    { institution: '', department: '', program: '', period: '', logo: '' }
  ]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Work Experience handlers
  const addWorkExperience = () => {
    setWorkExperience([...workExperience, { company: '', position: '', year: '', experience: '', logo: '' }]);
  };

  const removeWorkExperience = (index: number) => {
    if (workExperience.length > 1) {
      setWorkExperience(workExperience.filter((_, i) => i !== index));
    }
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = workExperience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setWorkExperience(updated);
  };

  // Education handlers
  const addEducation = () => {
    setEducation([...education, { institution: '', department: '', program: '', period: '', logo: '' }]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updated);
  };

  // Validation functions
  const validateStep1 = (): FormErrors => {
    const stepErrors: FormErrors = {};

    if (!formData.fullNames.trim())
      stepErrors.fullNames = "Full name is required";
    if (!formData.gender) stepErrors.gender = "Gender is required";
    if (!formData.dateOfBirth)
      stepErrors.dateOfBirth = "Date of birth is required";
    if (!formData.phoneNumber.trim())
      stepErrors.phoneNumber = "Phone number is required";
    if (!formData.email.trim()) stepErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      stepErrors.email = "Invalid email format";
    if (!formData.nationalId.trim())
      stepErrors.nationalId = "National ID is required";
    if (!formData.nationality.trim())
      stepErrors.nationality = "Nationality is required";
    if (!formData.contractType)
      stepErrors.contractType = "Contract type is required";

    return stepErrors;
  };

  const validateStep3 = (): FormErrors => {
    const stepErrors: FormErrors = {};

    if (!formData.workingPosition.trim())
      stepErrors.workingPosition = "Working position is required";
    if (!formData.salary || parseFloat(formData.salary) <= 0)
      stepErrors.salary = "Valid salary is required";

    return stepErrors;
  };

  // Navigation functions
  const nextStep = () => {
    let stepErrors: FormErrors = {};

    if (step === 1) {
      stepErrors = validateStep1();
    } else if (step === 3) {
      stepErrors = validateStep3();
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Calculate take home salary
  const calculateTakeHomeSalary = (): string => {
    const salary = parseFloat(formData.salary) || 0;
    const allowances = parseFloat(formData.totalAllowances) || 0;
    const total = salary + allowances;

    // Simple tax calculation (you might need to adjust this based on your business logic)
    const tax = total * 0.15; // Assuming 15% tax
    const takeHome = total - tax;

    return takeHome.toLocaleString("en-RW", {
      style: "currency",
      currency: "RWF",
      minimumFractionDigits: 0,
    });
  };

  // Submit form to API
  const handleSubmit = async () => {
    const stepErrors = validateStep3();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for API
      const apiData = {
        fullNames: formData.fullNames,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        academicRank: formData.academicRank || null,
        email: formData.email,
        nationalId: formData.nationalId,
        nationality: formData.nationality,
        contractType: formData.contractType,
        maritalStatus: formData.maritalStatus || null,
        religion: formData.religion || null,
        workingPosition: formData.workingPosition,
        salary: parseFloat(formData.salary),
        totalAllowances: parseFloat(formData.totalAllowances) || 0,
        bankAccount: formData.bankAccount || null,
        accountNumber: formData.accountNumber || null,
        tprLevel: formData.tprLevel || null,
        rssbNumber: formData.rssbNumber || null,
        role: formData.role,
        workExperience: workExperience.filter(exp => exp.company.trim() || exp.position.trim()),
        education: education.filter(edu => edu.institution.trim() || edu.program.trim()),
      };

      const response = await fetch("http://localhost:9005/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("User created successfully!");
        // Reset form
        setTimeout(() => {
          setFormData({
            fullNames: "",
            gender: "",
            dateOfBirth: "",
            phoneNumber: "",
            email: "",
            nationalId: "",
            nationality: "",
            religion: "",
            academicRank: "",
            maritalStatus: "",
            contractType: "",
            workingPosition: "",
            bankAccount: "",
            accountNumber: "",
            salary: "",
            tprLevel: "",
            rssbNumber: "",
            totalAllowances: "",
            role: ENUMS.USER_ROLE.EMPLOYEE,
          });
          setWorkExperience([{ company: '', position: '', year: '', experience: '', logo: '' }]);
          setEducation([{ institution: '', department: '', program: '', period: '', logo: '' }]);
          setStep(1);
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrors({ submit: result.message || "Failed to create user" });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full mx-auto max-w-6xl">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}

      <div className="flex space-x-2 bg-[#31408A96] mb-6 rounded-xl">
        {["Workers Dash", "Workers Performance", "Workers Attendance"].map(
          (tab, idx) => (
            <div
              key={idx}
              className={`flex-1 text-center p-4 rounded-xl text-white cursor-pointer ${
                step === idx + 1 ? "bg-[#31408A]" : ""
              }`}
            >
              {tab}
            </div>
          )
        )}
      </div>

      <h2 className="text-center text-xl font-bold text-blue-900 mb-4">
        Workers Management ({step}/3)
      </h2>

      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <input
              name="fullNames"
              value={formData.fullNames}
              onChange={handleInputChange}
              placeholder="Enter Fullnames"
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.fullNames ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.fullNames && (
              <p className="text-red-500 text-sm mt-1">{errors.fullNames}</p>
            )}
          </div>

          <div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.gender ? "border-2 border-red-500" : ""
              }`}
            >
              <option value="">Choose Gender</option>
              {getEnumOptions(ENUMS.GENDER).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter Mobile Phone"
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.phoneNumber ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter E-mail Address"
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.email ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder="Enter National / Passport ID"
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.nationalId ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.nationalId && (
              <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>
            )}
          </div>

          <div>
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.dateOfBirth ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleInputChange}
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            >
              <option value="">Choose Religion</option>
              {getEnumOptions(ENUMS.RELIGION).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              placeholder="Nationality"
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.nationality ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>
            )}
          </div>

          <div>
            <select
              name="academicRank"
              value={formData.academicRank}
              onChange={handleInputChange}
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            >
              <option value="">Choose Academic Rank</option>
              {getEnumOptions(ENUMS.ACADEMIC_RANK).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            >
              <option value="">Marital Status</option>
              {getEnumOptions(ENUMS.MARITAL_STATUS).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="contractType"
              value={formData.contractType}
              onChange={handleInputChange}
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.contractType ? "border-2 border-red-500" : ""
              }`}
            >
              <option value="">Type of Contract</option>
              {getEnumOptions(ENUMS.CONTRACT_TYPE).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.contractType && (
              <p className="text-red-500 text-sm mt-1">{errors.contractType}</p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          {/* Work Experience Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Work Experience</h3>
              <button
                onClick={addWorkExperience}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Experience
              </button>
            </div>
            
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border relative">
                  {workExperience.length > 1 && (
                    <button
                      onClick={() => removeWorkExperience(index)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Position/Job Title"
                      value={exp.position}
                      onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Year (e.g., 2020-2023)"
                      value={exp.year}
                      onChange={(e) => updateWorkExperience(index, 'year', e.target.value)}
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Company Logo URL (optional)"
                      value={exp.logo}
                      onChange={(e) => updateWorkExperience(index, 'logo', e.target.value)}
                    />
                  </div>
                  <textarea
                    className="w-full bg-[#D0D4D8] p-2 rounded-[6px] mt-4"
                    placeholder="Describe your experience and responsibilities..."
                    rows={3}
                    value={exp.experience}
                    onChange={(e) => updateWorkExperience(index, 'experience', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Education</h3>
              <button
                onClick={addEducation}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <Plus size={16} />
                Add Education
              </button>
            </div>
            
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border relative">
                  {education.length > 1 && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Department/Faculty"
                      value={edu.department}
                      onChange={(e) => updateEducation(index, 'department', e.target.value)}
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Program/Degree"
                      value={edu.program}
                      onChange={(e) => updateEducation(index, 'program', e.target.value)}
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Period (e.g., 2018-2022)"
                      value={edu.period}
                      onChange={(e) => updateEducation(index, 'period', e.target.value)}
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px] sm:col-span-2"
                      placeholder="Institution Logo URL (optional)"
                      value={edu.logo}
                      onChange={(e) => updateEducation(index, 'logo', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <input
              name="workingPosition"
              value={formData.workingPosition}
              onChange={handleInputChange}
              placeholder="Choose Working Position"
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.workingPosition ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.workingPosition && (
              <p className="text-red-500 text-sm mt-1">
                {errors.workingPosition}
              </p>
            )}
          </div>

          <div>
            <input
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleInputChange}
              placeholder="Choose Bank for payment"
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            />
          </div>

          <div>
            <input
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              placeholder="Enter Account Number"
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            />
          </div>

          <div>
            <input
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Enter Salary Amount"
              className={`w-full bg-[#D0D4D8] p-2 rounded-[6px] ${
                errors.salary ? "border-2 border-red-500" : ""
              }`}
            />
            {errors.salary && (
              <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
            )}
          </div>

          <div>
            <select
              name="tprLevel"
              value={formData.tprLevel}
              onChange={handleInputChange}
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            >
              <option value="">Choose TPR Level</option>
              {getEnumOptions(ENUMS.TPR_LEVEL).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              name="rssbNumber"
              value={formData.rssbNumber}
              onChange={handleInputChange}
              placeholder="Enter RSSB Number"
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            />
          </div>

          <div>
            <input
              name="totalAllowances"
              type="number"
              value={formData.totalAllowances}
              onChange={handleInputChange}
              placeholder="Total Allowances (if any)"
              className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
            />
          </div>

          <div className="sm:col-span-3">
            <div className="text-blue-900 font-medium border border-blue-500 rounded-md p-2 w-full">
              Take Home Salary: {calculateTakeHomeSalary()}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Back
          </button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Employee"}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepForm;