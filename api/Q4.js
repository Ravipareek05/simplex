export default function handler(req, res) {
  // Tells Vercel to serve this as plain text for MATLAB to read
  res.setHeader('Content-Type', 'text/plain');
  
  res.status(200).send(`
clc;
clear;

f = @(x1, x2) x1^2 + 2*x2^2;
grad_f = @(x1, x2) [2*x1; 4*x2];
x = [3; 3];
alpha = 0.1;
tol = 1e-6;
max_iter = 100;

for iter = 1:max_iter
    gradient = grad_f(x(1), x(2));
    if norm(gradient) < tol
        fprintf('Converged at iteration %d\\n', iter);
        break;
    end
    x = x - alpha * gradient;
end

fprintf('Optimal x1 = %.6f\\n', x(1));
fprintf('Optimal x2 = %.6f\\n', x(2));
fprintf('Minimum value = %.6f\\n', f(x(1), x(2)));
  `);
}
