#!/usr/bin/env python
# coding: utf-8

# In[15]:


import pytesseract
import re
import cv2
from datetime import datetime
import matplotlib.pyplot as plt


# In[17]:


# Load prescription image
# img = r"C:\Users\mahaw\OneDrive\Desktop\DIP Prescription Images\KM_prescription.jpg"
# img = r"C:\Users\mahaw\OneDrive\Desktop\DIP Prescription Images\PatientNameMrs.png"
# img = r"C:\Users\mahaw\OneDrive\Desktop\DIP Prescription Images\Age_displaced.png"
img = r"C:\Users\mahaw\OneDrive\Desktop\DIP Prescription Images\KM_prescription3.png"
imgplot = cv2.imread(img)
plot = plt.imshow(imgplot)
plt.show()


# In[18]:


# Extract text using Tesseract OCR
text = pytesseract.image_to_string(img)
print(text)


# In[19]:


# Extract patient name
patient_name_pattern1 = r"(Patient\s*Name|Name)\s*:\s*(.*)\s*(Age)"
patient_name_pattern2 = r"(Patient\s*Name|Name)\s*:\s*(.*)\s*(\s*)"
patient_name_match1 = re.search(patient_name_pattern1, text)
patient_name_match2 = re.search(patient_name_pattern2, text)
if (patient_name_match1):
    patient_name = patient_name_match1.group(2)
else:
    patient_name = patient_name_match2.group(2)
patient_title = r"(Miss|Mr?s)\.?\s"
patient_title_match = re.search(patient_title,patient_name)
if(patient_title_match):
    new_patient_name = re.sub(patient_title, "", patient_name)


# In[20]:


#Extract Consultation Date
# Define regular expressions for different date formats
date_patterns = [
    r'\d{1,2}/\d{1,2}/\d{4}',    # mm/dd/yyyy
    r'[a-zA-Z]{3,}\s+\d{1,2},\s+\d{4}',    # Month dd, yyyy
    r'\d{1,2}\s+[a-zA-Z]{3,}\s+\d{4}',    # dd Month yyyy
    r'\d{1,2}-[a-zA-Z]{3,}-\d{4}',    # dd-Month-yyyy
    r'\d{1,2}/\d{1,2}/\d{2}',    # mm/dd/yy
    r'\d{1,2}/\d{1,2}/\d{2}',    # dd-mm-yy
    r'\d{1,2}-[a-zA-Z]{3}-\d{2}',    # dd-Month-yy
    r'\d{1,2}/[a-zA-Z]{3}/\d{4}',    # dd/Month/yyyy
    r'\d{4}/\d{2}/\d{2}'    # yyyy/mm/dd
]
# Loop through the date patterns and extract the first match
for pattern in date_patterns:
    match = re.search(pattern, text)
    if(match):
        date = match.group()
        break
#     if match:
#         # Convert the matched string to a datetime object
#         date_str = match.group()
#         date_obj = datetime.strptime(date_str, '%m/%d/%Y') if '/' in date_str else \
#                    datetime.strptime(date_str, '%d %B %Y') if ' ' in date_str else \
#                    datetime.strptime(date_str, '%B %d, %Y') if ',' in date_str else \
#                    datetime.strptime(date_str, '%d %B %Y') if ' ' in date_str else \
#                    datetime.strptime(date_str, '%d-%b-%Y') if '-' in date_str else \
#                    datetime.strptime(date_str, '%m/%d/%y') if '/' in date_str else \
#                    datetime.strptime(date_str, '%d-%m-%y') if '-' in date_str else \
#                    datetime.strptime(date_str, '%d-%b-%y') if '-' in date_str else \
#                    datetime.strptime(date_str, '%Y/%m/%d')
#         print(date_obj)
#         break


# In[21]:


#Extract Patient Age/Sex
age_and_sex_pattern = r"Age:\s*(\d+)\s*(?:Years)?\s*/\s*(M(?:ale)?|F(?:emale)?)"
match = re.search(age_and_sex_pattern, text)
if match:
    age = match.group(1)
    sex = match.group(2)
else:
    print("No age and sex information found in input string")


# In[22]:


#Extract Hospital Name
# hospital_regex = re.compile(r"(?i)(?:medical\s+center|hospital|clinic|healthcare|medical group|medical practice)?[\s-]*(\w+(?:\s+\w+)*)\s+(?:(?:\w+,\s+)?\w+)?")

# # Search the prescription text for the hospital name
# hospital_regex_match = hospital_regex.search(text)

# # If a match is found, extract the hospital name
# if match:
#     hospital_name = hospital_regex_match.group()
# else:
#     print("Hospital name not found in prescription.")

hospital_regex = re.compile(r"(?i)\b(?:medical\s+center|hospital|clinic|healthcare|medical group|medical practice)?[\s-]*(\w+(?:\s+\w+)*)(?=\s*(?:\n|$))")
hospital_regex_match = hospital_regex.search(text)

if hospital_regex_match:
    hospital_name = hospital_regex_match.group(1)
    print(f"Hospital name: {hospital_name}")
else:
    print("Hospital name not found in prescription.")


# In[23]:


#Extract Doctor Name
doctor_regex = re.compile(r"Dr\. (\S+ \S+)")
doctor_regex_match = doctor_regex.search(text)
if match:
    doctor_name = doctor_regex_match.group()
else:
    print("Doctor's name not found in prescription.")


# In[24]:


#Extract Drug Info (Rx details)
import re

def parse_prescription(prescription):
    drug_types = {"cap": "Capsule", "tab": "Tablet", "syp": "Syrup"}
    frequencies = {"bd": "Twice a day", "od": "Once a day"}

    lines = prescription.split("\n")
    drug_info = []
    for line in lines:
        if line.strip() != "":
            match = re.search(r"([A-Za-z]+)\.?\s*([A-Za-z]*\d*)?\s*(\d+\s*(?:Tab|Cap)|\d+ml)?\s*([BbOoDd]*)\s*x?\s*(\d+)\s*(day[s]?)?", line)
            if match:
                drug_type = drug_types.get(match.group(1).lower())
                drug_name = match.group(2).strip().title()
                dosage = match.group(3)
                if dosage:
                    if "ml" in dosage:
                        dosage = dosage.replace("ml", "mL")
                    dosage = dosage.title()
                frequency = frequencies.get(match.group(4).lower(), "Once a day")
                duration = match.group(5)
                duration_unit = match.group(6) or "days"
                drug_info.append((drug_type, drug_name, dosage, frequency, duration, duration_unit))

    for i, info in enumerate(drug_info):
        print(f"Drug {i+1}:")
        print(f"Drug type: {info[0]}")
        print(f"Drug name: {info[1]}")
        print(f"Dosage: {info[2]}" if info[2] else "")
        print(f"Frequency: {info[3]}")
        print(f"Duration: {info[4]} {info[5]}")
        print("")


# In[25]:


# # Print extracted details
print('Patient Name:', new_patient_name)
print('Consultation Date:',date)
print("Age: {}, Sex: {}".format(age, sex))
print('Doctor Name:', doctor_name)
print('Hospital Name:', hospital_name)
parse_prescription(text)
# print('Dosage:', dosage)
# print('Drug Name:', drug_name)


# In[ ]:




