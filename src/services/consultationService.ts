/**
 * Consultation Service
 * Handles submission to Google Sheets and sends confirmation email
 */

interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  interest: string;
}

/**
 * Submit consultation data to Google Sheets and send email confirmation
 */
export const submitConsultation = async (data: ConsultationData) => {
  try {
    const response = await fetch("/api/consultation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit consultation");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting consultation:", error);
    throw error;
  }
};
