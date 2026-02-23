import { ExcelParseResult, User } from "./types";

export class ExcelService {
  private static instance: ExcelService;

  private constructor() {}

  static getInstance(): ExcelService {
    if (!ExcelService.instance) {
      ExcelService.instance = new ExcelService();
    }
    return ExcelService.instance;
  }

  async parseExcelFile(file: File): Promise<ExcelParseResult> {
    try {
      // Dynamically import read-excel-file
      const readXlsxFile = await import("read-excel-file");

      const rows = await readXlsxFile.default(file);
      console.log("Excel rows read:", rows.length);

      // Skip header row (if exists)
      const dataRows = rows.slice(1);

      const users = this.mapExcelDataToUsers(dataRows);

      return {
        users,
        fileName: file.name,
        count: users.length,
      };
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      throw new Error("فشل في قراءة ملف Excel. تأكد من صحة تنسيق الملف.");
    }
  }

  private mapExcelDataToUsers(excelRows: any[][]): User[] {
    return excelRows.map((row, index) => {
      // Map columns by index (assuming specific order)
      const user: User = {
        id: parseInt(row[0]) || index + 1,
        fullname: String(row[1] || ""),
        firstname: String(row[1] || ""),
        lastname: String(
          (row[1] as string)
            .split(" ")
            .filter((_, idx) => idx !== 0)
            .join(" ") || "",
        ),
        email: String(row[2] || ""),
        level: String(row[3] || "غير محدد"),
        phone: String(row[4] || ""),
        parent: {
          phone: String(row[5] || ""),
        },
        roles: [
          {
            id: 3,
            name: "Student",
            description: "System student.",
          },
        ],
      };

      return user;
    });
  }

  validateExcelData(data: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.length === 0) {
      errors.push("الملف فارغ أو لا يحتوي على بيانات");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const excelService = ExcelService.getInstance();
