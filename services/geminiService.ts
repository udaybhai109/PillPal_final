import { Medication } from '../types';

const apiKey = '';

interface PrescriptionResult {
  medications: (Medication & { total_pills?: number })[];
}

export async function parsePrescription(base64: string): Promise<PrescriptionResult> {
  try {
    // Placeholder: In production, implement Gemini API integration
    // with import.meta.env.VITE_GEMINI_API_KEY
    console.log('Parsing prescription with base64:', base64.substring(0, 50) + '...');
    return { medications: [] };
  } catch (error) {
    console.error('Error parsing prescription:', error);
    return { medications: [] };
  }
}

export async function checkInteractions(medicationNames: string[]): Promise<string | null> {
  if (medicationNames.length < 2) {
    return null;
  }

  try {
    // Placeholder: In production, implement Gemini API integration
    console.log('Checking interactions for:', medicationNames);
    return null;
  } catch (error) {
    console.error('Error checking interactions:', error);
    return null;
  }
}
