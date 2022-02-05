export const registrationEmail = (
  firstName: string,
  registrationToken: string
) =>
  `Hello ${firstName},<br><br>Welcome to Rooster!!<br><br>This is the <a href="http://localhost:3000/user/registrationConfirmation?token=${registrationToken}">registration confirmation link</a>.<br><br>Kind regards,<br><strong>The Rooster Team</strong>`;

export const passwordResetEmail = (
  firstName: string,
  passwordResetUrl: string
) =>
  `Hello ${firstName},<br><br>This is the <a href="http://localhost:3000${passwordResetUrl}">password reset link</a>.<br><br>Kind regards,<br><strong>The Rooster Team</strong>`;
