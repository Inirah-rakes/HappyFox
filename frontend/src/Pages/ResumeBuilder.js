import { useEffect, useState, useRef,  } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
const StudentDataSender = () => {
  // State to store the response from the Flask backend
  const [responseData, setResponseData] = useState(null);
  const resumeRef = useRef(null); // Ref for the resume content to convert to PDF
  const [dynamicData, setDynamicData] = useState(null);
  const [formData, setFormData] = useState({
      studentId: 'STU001',
      personalInfo: { fullName: '', professionalTitle: '' },
      contactInfo: { email: '', phone: '', linkedin: '', github: '', portfolio: '' },
      summary: '',
      education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' }],
      skills: { programmingLanguages: [], frameworks: [], databases: [], tools: [] },
      projects: [{ title: '', description: '', technologies: [], link: '' }],
      experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [] }],
      achievements: [''],
  });
  // Student data to send
  const studentData = {
    studentDetails: {
      personalInfo: {
        fullName: "HARINI S",
        professionalTitle: "Full Stack Developer",
      },
      contactInfo: {
        email: "harini@example.com",
        phone: "+91 98765 43210",
        linkedin: "https://www.linkedin.com/in/sample/?originalSubdomain=in",
        github: "github.com/sample",
        portfolio: "https:/example.com"
      },
      summary: "A highly motivated and detail-oriented Computer Science student with a passion for developing innovative software solutions. Seeking to leverage strong skills in Python and web development to contribute to a challenging engineering role.",
      education: [
        {
          institution: "Kumaraguru College of Technology",
          degree: "MCA (Master of Computer Applications)",
          fieldOfStudy: "Computer Science",
          startDate: "2024-08-01",
          endDate: "2026-05-31",
          gpa: 8.7
        },
        {
          institution: "ABC Higher Secondary School",
          degree: "HSC (Higher Secondary Certificate)",
          fieldOfStudy: "Computer Science",
          endDate: "2022-03-15",
          gpa: 9.2
        }
      ],
      skills: {
        programmingLanguages: ["Python", "JavaScript", "Java", "C++"],
        frameworks: ["React", "Node.js", "Express.js", "Flask"],
        databases: ["MongoDB", "MySQL"],
        tools: ["Git", "Docker", "VS Code", "Postman"]
      },
      projects: [
        {
          title: "AI-Powered Placement Portal",
          description: "Developed a full-stack web application to streamline the campus placement process using the MERN stack and a Python-based recommendation engine.",
          technologies: ["React", "Node.js", "MongoDB", "Flask"],
          link: "github.com/priyak/placement-portal"
        },
        {
          title: "E-commerce Price Tracker",
          description: "Created a Python script that scrapes e-commerce websites to track product prices and sends email notifications on price drops.",
          technologies: ["Python", "Beautiful Soup", "SMTP"],
          link: "github.com/priyak/price-tracker"
        }
      ],
      experience: [
        {
          title: "Web Development Intern",
          company: "Tech Solutions Inc.",
          location: "Coimbatore, India",
          startDate: "2025-06-01",
          endDate: "2025-07-31",
          responsibilities: [
            "Assisted in developing and maintaining the company's client-facing web portal using React.",
            "Collaborated with the backend team to integrate REST APIs.",
            "Participated in daily stand-up meetings and agile development cycles."
          ]
        }
      ],
      achievements: [
        "Winner of 'CodeFest 2024' hackathon.",
        "Published a technical article on 'Introduction to Flask' on a popular blog."
      ]
    }
  };

  const dynamicStudentData = async () => {
      try {
        console.log("started fetching data");
        const res = await axios.get('http://localhost:3001/api/profile/STU001');
        console.log("fetched on resume builder: ",res);
        if (res.data) {
          setDynamicData(res.data);
          console.log(dynamicData)
          setFormData({
            ...formData,
            ...res.data,
            education: res.data.education && res.data.education.length > 0 ? res.data.education : formData.education,
            skills: res.data.skills || formData.skills,
            projects: res.data.projects && res.data.projects.length > 0 ? res.data.projects : formData.projects,
            experience: res.data.experience && res.data.experience.length > 0 ? res.data.experience : formData.experience,
            achievements: res.data.achievements || formData.achievements,
          });
          console.log("Form data updated with fetched profile data:", formData);
        } 
        
      } catch (err) {
        console.error('Error fetching profile:', err);
      };}

  // Function to send data to Node.js backend (which forwards to Flask)
  const sendData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/forward-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        const data = await response.json();
        // Parse the generated_resume_text if it's a JSON string
        if (data.generated_resume_text) {
          try {
            // Remove ```json markers and parse
            const cleanedJson = data.generated_resume_text
              .replace(/^```json\n/, '')
              .replace(/\n```$/, '');
            const parsedResume = JSON.parse(cleanedJson);
            setResponseData(parsedResume);
            console.log('Resume data parsed and stored in responseData');
          } catch (parseError) {
            console.error('Error parsing resume JSON:', parseError);
          }
        } else {
          console.error('No generated_resume_text in response');
        }
      } else {
        console.error(`Failed to send data. Status: ${response.status}`);
        console.error(await response.text());
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Function to generate and download PDF
  const generatePDF = () => {
    if (!resumeRef.current) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Extract text content from the resume DOM element
    const resumeContent = resumeRef.current.innerText;
    const lines = doc.splitTextToSize(resumeContent, 180); // Wrap text to fit page width
    doc.text(lines, 10, 10); // Add text at position (10, 10)
    doc.save('Student_resume.pdf'); // Download PDF
  };

  // Call sendData when component mounts
  useEffect(() => {
    dynamicStudentData();
    sendData();
  }, []);

  return (
    <div>
      <h1>Resume Generator</h1>
      <p>Data is being sent to the backend. Check the console for details.</p>
      {responseData && (
        <div>
          <button onClick={generatePDF}>Download Resume as PDF</button>
          <div ref={resumeRef}>
            <h2>{responseData.fullName}</h2>
            <p>{responseData.professionalTitle}</p>
            <p>
              Email: {responseData.contact.email} | Phone: {responseData.contact.phone} | 
              LinkedIn: <a href={responseData.contact.linkedin}>{responseData.contact.linkedin}</a> | 
              GitHub: <a href={responseData.contact.github}>{responseData.contact.github}</a>
            </p>
            <h3>Summary</h3>
            <p>{responseData.summary}</p>

            {responseData.sections.map((section, index) => (
              <div key={index}>
                <h3>{section.title}</h3>
                {section.type === 'categorized_list' ? (
                  Object.entries(section.content).map(([category, items]) => (
                    <div key={category}>
                      <h4>{category}</h4>
                      <ul>
                        {items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : section.type === 'itemized_list' ? (
                  section.content.map((item, i) => (
                    <div key={i}>
                      <h4>{item.heading}</h4>
                      <p>{item.subheading}{item.date ? ` | ${item.date}` : ''}</p>
                      <ul>
                        {item.points.map((point, j) => (
                          <li key={j}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : section.type === 'simple_list' ? (
                  <ul>
                    {section.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDataSender;