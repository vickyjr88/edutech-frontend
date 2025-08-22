import React from 'react';
import { LoginFlow, SelfServiceLoginFlow } from '@ory/elements';

const LoginPage: React.FC = () => {
  const [flow, setFlow] = React.useState<SelfServiceLoginFlow | null>(null);

  React.useEffect(() => {
    setFlow(() => ({
      id: 'login-flow',
      fields: [
        {
          name: 'identifier',
          type: 'text',
          required: true,
          label: 'Email',
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

  return flow ? <LoginFlow flow={flow} /> : null;
};

export default LoginPage;
