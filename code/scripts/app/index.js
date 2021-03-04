import ViewApplicants from './pages/view-applicants.js';

export default function app(link){
    switch(link){
        case 'view-applicants': 
            ViewApplicants();
        break;
    }
}