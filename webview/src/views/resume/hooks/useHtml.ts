import { ref } from 'vue'

enum ResumeModuleKeys {
    Personal = 'personal',
    Education = 'education',
    WorkExp = 'work_exp',
    ProjectExp = 'project_exp',
    Summary = 'summary',
    Other = 'other'
}

const resumeData = ref({
    personal: {
        data: [
            {
                name: '',
                phone: '',
                email: '',
                slaray: '',
                intention_job: '',
                job_status: '',
                intention_city: '',
                avatar: ''
            }
        ]
    },
    education: {
        data: [
            {
                school: '',
                degree: '',
                college: '',
                major: '',
                city: '',
                start_date: '',
                end_date: '',
                desc: ''
            }
        ]
    },
    work_exp: {
        data: [
            {
                company: '',
                department: '',
                job: '',
                city: '',
                tags: [],
                start_date: '',
                end_date: '',
                desc: ''
            }
        ]
    },
    project_exp: {
        data: [
            {
                name: '',
                role: '',
                company: '',
                start_date: '',
                end_date: '',
                desc: ''
            }
        ]
    },
    summary: {
        data: [
            {
                desc: ''
            }
        ]
    }
})

const personalListItems = ` <div>{{phone}}</div>
                            <div>{{email}}</div>
                            <div>{{slaray}}</div>
                            <div>{{intention_job}}</div>
                            <div>{{job_status}}</div>
                            <div>{{intention_city}}</div>`
const expListItems = `<div>{{company}}</div>
                        <div>{{department}}</div>
                        <div>{{job}}</div>
                        <div>{{city}}</div>
                        <div>{{start_date}}-{{end_date}}</div>`

const moduleHtmlData = {
    personal: {
        template: ` `,
        style: ``
    },
    other: {
        tempalte: ` `,
        style: ``
    }
}

export const useHtml = () => {
    const getHtmlByModule = (moduleKey: ResumeModuleKeys) => {}

    const setResumeDataToHtml = () => {}

    return { getHtmlByModule }
}
