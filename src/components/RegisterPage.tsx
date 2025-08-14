import React from 'react';
import { RegistrationFlow, SelfServiceRegistrationFlow } from '@ory/elements';

const RegisterPage: React.FC = () => {
  const [flow, setFlow] = React.useState<SelfServiceRegistrationFlow | null>(null);

  React.useEffect(() => {
    setFlow(() => ({
      id: 'registration-flow',
      fields: [
        {
          name: 'traits.email',
          type: 'email',
          required: true,
          label: 'Email',
        },
        {
          name: 'traits.name.first',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'traits.name.last',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'traits.role',
          type: 'select',
          required: true,
          label: 'Role',
          options: [
            { value: 'student', label: 'Student' },
            { value: 'teacher', label: 'Teacher' },
            { value: 'parent', label: 'Parent' },
          ],
        },
        {
          name: 'password',
          type: 'password',
          required: true,
          label: 'Password',
        },
      ],
    }));
  }, []);

  return flow ? <RegistrationFlow flow={flow} /> : null;
};

export default RegisterPage;
