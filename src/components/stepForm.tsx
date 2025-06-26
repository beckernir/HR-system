import React, { useState } from "react";
import { ImageIcon, Plus, Upload, X } from "lucide-react";


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
    LEVEL1: "LEVEL_1",
    LEVEL2: "LEVEL_2",
    LEVEL3: "LEVEL_3",
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
  photo: File | null;
  visaStartDate: string;
  visaEndDate: string;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  

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
    photo: null,
    visaStartDate: "",
    visaEndDate: "",
  });

  // New state for education and work experience
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    { company: "", position: "", year: "", experience: "", logo: "" },
  ]);

  const [education, setEducation] = useState<Education[]>([
    { institution: "", department: "", program: "", period: "", logo: "" },
  ]);
// Check if user is Rwandan
  const isRwandan =
    formData.nationality.toLowerCase().includes("rwanda") ||
    formData.nationality.toLowerCase().includes("rwandan");

  // Image validation function
  const validateImage = (file: File): string | null => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)";
    }

    if (file.size > maxSize) {
      return "Image size should be less than 5MB";
    }

    return null;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setErrors((prev) => ({ ...prev, profileImage: validationError }));
      return;
    }

    // Clear any previous image errors
    setErrors((prev) => ({ ...prev, profileImage: "" }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Update form data
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  // Remove uploaded image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };
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
    // Clear visa dates if user becomes Rwandan
    if (name === "nationality") {
      const isBecomingRwandan =
        value.toLowerCase().includes("rwanda") ||
        value.toLowerCase().includes("rwandan");
      if (isBecomingRwandan) {
        setFormData((prev) => ({
          ...prev,
          visaStartDate: "",
          visaEndDate: "",
        }));
        setErrors((prev) => ({
          ...prev,
          visaStartDate: "",
          visaEndDate: "",
        }));
      }
    }
  };

  // Work Experience handlers
  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      { company: "", position: "", year: "", experience: "", logo: "" },
    ]);
  };

  const removeWorkExperience = (index: number) => {
    if (workExperience.length > 1) {
      setWorkExperience(workExperience.filter((_, i) => i !== index));
    }
  };

  const updateWorkExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updated = workExperience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setWorkExperience(updated);
  };

  // Education handlers
  const addEducation = () => {
    setEducation([
      ...education,
      { institution: "", department: "", program: "", period: "", logo: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
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

    // Validate visa dates for non-Rwandan users
    if (!isRwandan) {
      if (!formData.visaStartDate) {
        stepErrors.visaStartDate =
          "Visa start date is required for non-Rwandan citizens";
      }
      if (!formData.visaEndDate) {
        stepErrors.visaEndDate =
          "Visa end date is required for non-Rwandan citizens";
      }
      if (formData.visaStartDate && formData.visaEndDate) {
        const startDate = new Date(formData.visaStartDate);
        const endDate = new Date(formData.visaEndDate);
        if (endDate <= startDate) {
          stepErrors.visaEndDate = "Visa end date must be after start date";
        }
      }
    }

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
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('fullNames', formData.fullNames);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('nationalId', formData.nationalId);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('contractType', formData.contractType);
      formDataToSend.append('workingPosition', formData.workingPosition);
      formDataToSend.append('salary', formData.salary);
      formDataToSend.append('role', formData.role);
      
      // Add optional fields only if they have values
      if (formData.academicRank) formDataToSend.append('academicRank', formData.academicRank);
      if (formData.maritalStatus) formDataToSend.append('maritalStatus', formData.maritalStatus);
      if (formData.religion) formDataToSend.append('religion', formData.religion);
      if (formData.totalAllowances) formDataToSend.append('totalAllowances', formData.totalAllowances);
      if (formData.bankAccount) formDataToSend.append('bankAccount', formData.bankAccount);
      if (formData.accountNumber) formDataToSend.append('accountNumber', formData.accountNumber);
      if (formData.tprLevel) formDataToSend.append('tprLevel', formData.tprLevel);
      if (formData.rssbNumber) formDataToSend.append('rssbNumber', formData.rssbNumber);
      
      // Add photo if exists
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      
      // Add work experience as JSON string
      const filteredWorkExperience = workExperience.filter(
        (exp) => exp.company.trim() || exp.position.trim()
      );
      if (filteredWorkExperience.length > 0) {
        formDataToSend.append('workExperience', JSON.stringify(filteredWorkExperience));
      }
      
      // Add education as JSON string
      const filteredEducation = education.filter(
        (edu) => edu.institution.trim() || edu.program.trim()
      );
      if (filteredEducation.length > 0) {
        formDataToSend.append('education', JSON.stringify(filteredEducation));
      }
    
      const response = await fetch("http://localhost:9005/api/users", {
        method: "POST",
        body: formDataToSend, // Don't set Content-Type header, let browser set it
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
            photo: null,
            visaEndDate: "",
            visaStartDate: "",
          });
          setWorkExperience([
            { company: "", position: "", year: "", experience: "", logo: "" },
          ]);
          setEducation([
            {
              institution: "",
              department: "",
              program: "",
              period: "",
              logo: "",
            },
          ]);
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
        <div className="space-y-6">
          {/* Profile Image Upload Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Profile Photo
            </h3>
            <div className="flex items-start gap-6">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <div className="mb-2">
                  <label
                    htmlFor="profileImage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload Profile Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="profileImage"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                      <Upload size={16} />
                      Choose Image
                    </label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG, GIF, WEBP (Max size: 5MB)
                </p>
                {errors.profileImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.profileImage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth}
                </p>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.nationality}
                </p>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.contractType}
                </p>
              )}
            </div>
          </div>

          {/* Visa Information for Non-Rwandan Users */}
          {!isRwandan && formData.nationality.trim() && (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                Visa Information (Required for Non-Rwandan Citizens)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visa Start Date
                  </label>
                  <input
                    name="visaStartDate"
                    type="date"
                    value={formData.visaStartDate}
                    onChange={handleInputChange}
                    className={`w-full bg-white p-2 rounded-[6px] border ${
                      errors.visaStartDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.visaStartDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.visaStartDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visa End Date
                  </label>
                  <input
                    name="visaEndDate"
                    type="date"
                    value={formData.visaEndDate}
                    onChange={handleInputChange}
                    min={formData.visaStartDate}
                    className={`w-full bg-white p-2 rounded-[6px] border ${
                      errors.visaEndDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.visaEndDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.visaEndDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          {/* Work Experience Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                Work Experience
              </h3>
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
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border relative"
                >
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
                      onChange={(e) =>
                        updateWorkExperience(index, "company", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Position/Job Title"
                      value={exp.position}
                      onChange={(e) =>
                        updateWorkExperience(index, "position", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Year (e.g., 2020-2023)"
                      value={exp.year}
                      onChange={(e) =>
                        updateWorkExperience(index, "year", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Company Logo URL (optional)"
                      value={exp.logo}
                      onChange={(e) =>
                        updateWorkExperience(index, "logo", e.target.value)
                      }
                    />
                  </div>
                  <textarea
                    className="w-full bg-[#D0D4D8] p-2 rounded-[6px] mt-4"
                    placeholder="Describe your experience and responsibilities..."
                    rows={3}
                    value={exp.experience}
                    onChange={(e) =>
                      updateWorkExperience(index, "experience", e.target.value)
                    }
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
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border relative"
                >
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
                      onChange={(e) =>
                        updateEducation(index, "institution", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Department/Faculty"
                      value={edu.department}
                      onChange={(e) =>
                        updateEducation(index, "department", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Program/Degree"
                      value={edu.program}
                      onChange={(e) =>
                        updateEducation(index, "program", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px]"
                      placeholder="Period (e.g., 2018-2022)"
                      value={edu.period}
                      onChange={(e) =>
                        updateEducation(index, "period", e.target.value)
                      }
                    />
                    <input
                      className="w-full bg-[#D0D4D8] p-2 rounded-[6px] sm:col-span-2"
                      placeholder="Institution Logo URL (optional)"
                      value={edu.logo}
                      onChange={(e) =>
                        updateEducation(index, "logo", e.target.value)
                      }
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