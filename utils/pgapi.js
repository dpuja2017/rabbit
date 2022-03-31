import axios from 'axios';
import axiosRetry from 'axios-retry';

export const birdie = '02333';
export const driving = '102';
export const app100125 = '02364';
export const app125150 = '02366';
export const app150175 = '02367';
export const app175200 = '02368';
export const app200 = '02369';
export const scrambling = '130';
export const sandsave = '111';
export const putting = '02428';
export const overall = '127';

export const axiosInstance = axios.create();

export const urlToFetch = (stat_id) =>
	`https://tourapi.pgatourhq.com:8243/YTD_EVT_Statistics/1.0.0/?format=json&T_CODE=R&STAT_ID=${stat_id}&YEAR=2021&TYPE=YTD`;

export const playerBioURL = (player_id) =>
	`https://tourapi.pgatourhq.com:8243/SyndPlayerBio/1.0.0/?format=json&P_ID=${player_id}`;

axiosRetry(axios, {
	retries: 20, // number of retries
	retryDelay: (retryCount) => {
		return 2000; // time interval between retries
	},
	retryCondition: (error) => {
		// if retry condition is not specified, by default idempotent requests are retried
		return error.response.status === 429;
	},
});
const config = () => {
	return {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
};

export const fetchProfile = async (playerID) => {
	return await axios.get(playerBioURL(playerID), config());
};

export default fetchStats = async () => {
	return axios.all([
		axios.get(urlToFetch(driving), config()).catch((err) => console.log(err)),
		axios.get(urlToFetch(app100125), config()).catch((err) => console.log(err)),
		axios.get(urlToFetch(app125150), config()).catch((err) => console.log(err)),
		axios.get(urlToFetch(app150175), config()).catch((err) => console.log(err)),
		axios.get(urlToFetch(app175200), config()).catch((err) => console.log(err)),
		axios.get(urlToFetch(app200), config()).catch((err) => console.log(err)),
		axios.get(urlToFetch(putting), config()).catch((err) => console.log(err)),
		axios.get(urlToFetch(overall), config()).catch((err) => console.log(err)),
	]);
};

const addDelay = () => {
	// Add a request interceptor
	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	let prevDelay = 0;
	const getDelay = () => {
		const delay = prevDelay
			? prevDelay + 60000
			: 1000 * (61 - new Date().getSeconds());
		return prevDelay + 5000;
	};
	axiosInstance.interceptors.request.use(
		async (config) => {
			// Do something before request is sent
			if (config.url !== urlToFetch(driving)) {
				prevDelay = getDelay();
				await delay(prevDelay);
				//console.log('request sent', config.url, prevDelay);
			}
			return config;
		},
		function (error) {
			// Do something with request error
			return Promise.reject(error);
		}
	);
	// axiosInstance.interceptors.response.use(
	// 	(res) => {
	// 		// Add configurations here
	// 		console.log(Object.keys(res.data).length);
	// 	},
	// 	(err) => {
	// 		//console.log(err);
	// 		return Promise.reject(err);
	// 	}
	// );
};

export const token =
	'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IllUbGtaVEUyTW1OaFpUWTVZVGMzWW1FMVlXWXhNVEZrTW1ZelpUQTJPV1UzWldNeVlUVmtNQT09In0.eyJhdWQiOiJodHRwOlwvXC9vcmcud3NvMi5hcGltZ3RcL2dhdGV3YXkiLCJzdWIiOiJSYWJiaXRDYXJkQGNhcmJvbi5zdXBlciIsImFwcGxpY2F0aW9uIjp7Im93bmVyIjoiUmFiYml0Q2FyZCIsInRpZXIiOiIxMFBlck1pbiIsIm5hbWUiOiJzeW5kc2N0ZXN0IiwiaWQiOjQ4MSwidXVpZCI6bnVsbH0sInNjb3BlIjoiYW1fYXBwbGljYXRpb25fc2NvcGUgZGVmYXVsdCIsImlzcyI6Imh0dHBzOlwvXC9hcGktdGVzdC1zaXRlcy5wZ2F0b3VyaHEuY29tOjk0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJCcm9uemUiOnsic3RvcE9uUXVvdGFSZWFjaCI6dHJ1ZSwic3Bpa2VBcnJlc3RMaW1pdCI6MSwic3Bpa2VBcnJlc3RVbml0Ijoic2VjIn0sIlNpbHZlciI6eyJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjoxMCwic3Bpa2VBcnJlc3RVbml0Ijoic2VjIn19LCJrZXl0eXBlIjoiU0FOREJPWCIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlN5bmRTY29yZWNhcmQiLCJjb250ZXh0IjoiXC9TeW5kU2NvcmVjYXJkXC8xLjAuMCIsInB1Ymxpc2hlciI6ImtoYWxsIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTeW5kVG91cm5hbWVudEZpZWxkIiwiY29udGV4dCI6IlwvU3luZFRvdXJuYW1lbnRGaWVsZFwvMS4wLjAiLCJwdWJsaXNoZXIiOiJmY2xlYXJ5IiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJBdmFpbGFibGVUZXN0VG91cm5hbWVudHMiLCJjb250ZXh0IjoiXC9BdmFpbGFibGVUZXN0VG91cm5hbWVudHNcLzEuMC4wIiwicHVibGlzaGVyIjoidGVzdGFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTeW5kUGxheWVyc01hc3RlciIsImNvbnRleHQiOiJcL1N5bmRQbGF5ZXJzTWFzdGVyXC8xLjAuMCIsInB1Ymxpc2hlciI6ImtoYWxsIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTeW5kR3JvdXBpbmdzIiwiY29udGV4dCI6IlwvU3luZEdyb3VwaW5nc1wvMS4wLjAiLCJwdWJsaXNoZXIiOiJraGFsbCIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJCcm9uemUifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiU3luZExlYWRlcmJvYXJkIiwiY29udGV4dCI6IlwvU3luZExlYWRlcmJvYXJkXC8xLjAuMCIsInB1Ymxpc2hlciI6ImtoYWxsIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTeW5kU2NoZWR1bGUiLCJjb250ZXh0IjoiXC9TeW5kU2NoZWR1bGVcLzEuMC4wIiwicHVibGlzaGVyIjoia2hhbGwiLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiQnJvbnplIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlN5bmRQbGF5ZXJCaW8iLCJjb250ZXh0IjoiXC9TeW5kUGxheWVyQmlvXC8xLjAuMCIsInB1Ymxpc2hlciI6ImtoYWxsIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTeW5kVG91cm5hbWVudEhvbGVTdGF0cyIsImNvbnRleHQiOiJcL1N5bmRUb3VybmFtZW50SG9sZVN0YXRzXC8xLjAuMCIsInB1Ymxpc2hlciI6ImZjbGVhcnkiLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiQnJvbnplIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlN5bmRUb3VybmFtZW50RGV0YWlscyIsImNvbnRleHQiOiJcL1N5bmRUb3VybmFtZW50RGV0YWlsc1wvMS4wLjAiLCJwdWJsaXNoZXIiOiJmY2xlYXJ5IiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IkJyb256ZSJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJTeW5kVG91cm5hbWVudFN0YXR1cyIsImNvbnRleHQiOiJcL1N5bmRUb3VybmFtZW50U3RhdHVzXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFiYXJhZHdhaiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJCcm9uemUifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiUGxheUJ5UGxheSIsImNvbnRleHQiOiJcL1BsYXlCeVBsYXlcLzEuMC4wIiwicHVibGlzaGVyIjoibmJlY2tlciIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJCcm9uemUifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiWVREX0VWVF9TdGF0aXN0aWNzIiwiY29udGV4dCI6IlwvWVREX0VWVF9TdGF0aXN0aWNzXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFiYXJhZHdhaiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJTaWx2ZXIifV0sImNvbnN1bWVyS2V5IjoickJOdmtJeTB3cUp1N0xaUG9ITVFoYVpZSDJFYSIsImV4cCI6Mzc4MTUzNjkxMiwiaWF0IjoxNjM0MDUzMjY1LCJqdGkiOiIzZmM0ZWUxMi01NzY0LTQ1MDItODFhYy0wNDkxNzc2YzY1ZWEifQ.rdtqWiC__Ee6im--Gpyl3WbTZHMD8rk36Duprkdfr1V4xnjHbjwbhcUDpD7VeoLPjtscGBZwYPA5eMPmtA0izRORkZCYawUAsVSK9D-IUzXAIOBkMGSJUZ3UEheX9sB6aPDPekJJYINSYHAn0cLO6ecJqGzm2QVPtiUbirC2fAmtn95HqEa33qQjop8rapcnCCHHWWWU_Jbx-muoicFBYK_2r2UQxmb6ivsK6j96yRagSN3KLBSkDeF7mUeXdF1e8wdPrLDYOoLvKEaavHUM-viGxcN6AoFzHa-hMwzkBfP4cdSA2VEm_gv5y5mZV92UZW7xrk-itpPDt_GRAzZGAA';
