/**
 *
 * @param dobString date of birth format MM-DD-YYYY
 * @returns ageObject { year: number; month: number; day: number }
 */
export const calculateAge = (
	dobString: string
): { year: number; month: number; day: number } => {
	let currentDate = new Date();

	// Extracts year month day from currentDate
	let currentYear = currentDate.getFullYear();
	let currentMonth = currentDate.getMonth() + 1;
	let currentDay = currentDate.getDate();

	// Extracts year month day from dobString
	let dob = new Date(dobString);
	let dobYear = dob.getFullYear();
	let dobMonth = dob.getMonth() + 1;
	let dobDay = dob.getDate();

	// Age in years (difference between the dobYear and currentYear)
	let ageYear = currentYear - dobYear;

	// Months
	// If currentMonth less than dobMonth (Ex: cM=4 and dM=12 )
	// In this case, add 12 months (1 Year)
	//from age years(by subtracting one year from age) to currentMonth
	let ageMonth: number;
	if (currentMonth >= dobMonth) {
		ageMonth = currentMonth - dobMonth;
	} else {
		ageYear -= 1;
		ageMonth = 12 + currentMonth - dobMonth;
	}

	// Days
	// If currentDay less than dobDay (Ex: cD=4 and dD=12 )
	// In this case, add 31 days (1 month)
	// from age month(by subtracting one month from age) to current day
	let ageDay: number;
	if (currentDay >= dobDay) {
		ageDay = currentDay - dobDay;
	} else {
		ageMonth -= 1;
		ageDay = 31 + currentDay - dobDay;
	}

	//For edge cases like
	// ageMonth=0 (exact x years) and currentDay <= dobDay
	// in above else ageMonth decremented to -1
	// actual ageMonth 11 (ageMonth 12 === 1 Year)
	if (ageMonth < 0) {
		ageMonth = 11;
		ageYear -= 1;
	}

	if (ageYear > 0) {
		return {
			year: ageYear,
			month: ageMonth,
			day: ageDay,
		};
	}

	return {
		year: NaN,
		month: NaN,
		day: NaN,
	};
};
