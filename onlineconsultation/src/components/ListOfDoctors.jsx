// import React from 'react'
// import * as ReactDOM from 'react-dom';
// class Table extends React.Component {
//     constructor(props) {
//        super(props)
//        this.state = {
//           students: [
//              { id: 1, name: 'Wasif', age: 21, email: 'wasif@email.com' },
//              { id: 2, name: 'Ali', age: 19, email: 'ali@email.com' },
//              { id: 3, name: 'Saad', age: 16, email: 'saad@email.com' },
//              { id: 4, name: 'Asad', age: 25, email: 'asad@email.com' }
//           ]
//        }
//     }
 
//     renderTableHeader() {
//        let header = Object.keys(this.state.students[0])
//        return header.map((key, index) => {
//           return <th key={index}>{key.toUpperCase()}</th>
//        })
//     }
 
//     renderTableData() {
//        return this.state.students.map((student, index) => {
//           const { id, name, age, email } = student //destructuring
//           return (
//              <tr key={id}>
//                 <td>{id}</td>
//                 <td>{name}</td>
//                 <td>{age}</td>
//                 <td>{email}</td>
//              </tr>
//           )
//        })
//     }
 
//     render() {
//        return (
//           <div>
//              <h1 className='items-center' id='title'>React Dynamic Table</h1>
//              <table id='students' className='items-center border-collapse border-2 border-black'>
//                 <tbody>
//                    <tr>{this.renderTableHeader()}</tr>
//                    {this.renderTableData()}
//                 </tbody>
//              </table>
//           </div>
//        )
//     }
//  }
 
//  ReactDOM.render(<Table />, document.getElementById('root'));
import React from 'react'
const people = [
   {
     name: 'Jane Cooper',
     Specialist: 'Cardiologist',
     Hospital: 'Fortis Hospital',
     experience: '20 Years',
     email: 'jane.cooper@example.com',
     image: 'https://bit.ly/33HnjK0',
   },
   {
     name: 'John Doe',
     Specialist: 'Dermatologist',
     Hospital: 'Paras Hospital',
     experience: '30 Years',
     email: 'john.doe@example.com',
     image: 'https://bit.ly/3I9nL2D',
   },
   {
     name: 'Veronica Lodge',
     Specialist: 'Gynaecologist',
     Hospital: 'Alchemist Hospital',
     experience: ' 15 Years',
     email: 'veronica.lodge@example.com',
     image: 'https://bit.ly/3vaOTe1',
   },
   {
     name: 'Rajat Maheshwari',
     Specialist: 'Paediatrician',
     Hospital: 'PGI',
     experience: ' 10 Years',
     email: 'veronica.lodge@example.com',
     image: 'https://bit.ly/3vaOTe1',
   },
   // More people...
 ];
 
 export default function App() {
   return (
     <div className="flex flex-col">
       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th
                     scope="col"
                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                   >
                     Name
                   </th>
                   <th
                     scope="col"
                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                   >
                     Specialist
                   </th>
                   <th
                     scope="col"
                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                   >
                     Status
                   </th>
                   <th
                     scope="col"
                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                   >
                     Experience
                   </th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {people.map(person => (
                   <tr key={person.email}>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center">
                         <div className="flex-shrink-0 h-10 w-10">
                           <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
                         </div>
                         <div className="ml-4">
                           <div className="text-sm font-medium text-gray-900">{person.name}</div>
                           <div className="text-sm text-gray-500">{person.email}</div>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">{person.Specialist}</div>
                       <div className="text-sm text-gray-500">{person.Hospital}</div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span
                         className="px-2 inline-flex text-xs leading-5
                       font-semibold rounded-full bg-green-100 text-green-800"
                       >
                         Active
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       {person.experience}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>
   );
 }