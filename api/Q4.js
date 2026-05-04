export default function handler(req, res) {
  // Tells Vercel to serve this as plain text for MATLAB to read
  res.setHeader('Content-Type', 'text/plain');
  
  res.status(200).send(`
clc
clear

x = [1; 0.5];
f = @(x) x(1)^2 - x(1)*x(2) + x(2)^2;
grad = @(x) [2*x(1)-x(2); -x(1)+2*x(2)];

tol = 0.05;
maxIters = 1e4;

f_prev = f(x);

A = [2, -1; -1, 2]; % move outside loop

for k = 1:maxIters
    f_prev
    g = grad(x);
    
    % exact line search
    alpha = (g' * g) / (g' * (A * g));
    
    x = x - alpha * g;
    
    f_new = f(x);
    
    % stopping condition (as teacher wants)
    if abs(f_prev - f_new) <= tol
        break
    end
    
    f_prev = f_new;
end
f_new
x
k
  `);
}
