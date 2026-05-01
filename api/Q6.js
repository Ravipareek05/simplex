export default function handler(req, res) {
  // Tells Vercel to serve this as plain text for MATLAB to read
  res.setHeader('Content-Type', 'text/plain');
  
  res.status(200).send(`
clc
clear all

M = 1000; 
C = [-1 3 -2]; 

info = [3 -1 2;
       -2 4 0;
       -4 3 8];
b = [7; 12; 10];

[m, n] = size(info);

S = eye(m);             
A = [info S b];         
[m, tot_vars] = size(A);

Cost = zeros(1, tot_vars);
Cost(1:n) = C;          
Cost(n+1:n+m) = M;      

BV = n+1 : n+m;         

ZRow = Cost(BV) * A - Cost;

Run = true;
while Run
    ZC = ZRow(1:end-1);
    if any(ZC > 1e-5) 
        [~, Pvt_Col] = max(ZC);

        sol = A(:, end);
        Column = A(:, Pvt_Col);
        ratio = inf * ones(m, 1);
        for i = 1:m
            if Column(i) > 0
                ratio(i) = sol(i) / Column(i);
            end
        end

        if all(ratio == inf)
            error('Unbounded');
        end

        [~, Pvt_Row] = min(ratio);
        BV(Pvt_Row) = Pvt_Col;

        Pvt_Key = A(Pvt_Row, Pvt_Col);
        A(Pvt_Row, :) = A(Pvt_Row, :) / Pvt_Key;

        for i = 1:m
            if i ~= Pvt_Row
                A(i, :) = A(i, :) - A(i, Pvt_Col) * A(Pvt_Row, :);
            end
        end

        ZRow = ZRow - ZRow(Pvt_Col) * A(Pvt_Row, :);
    else
        Run = false;
    end
end

BFS = zeros(1, size(A, 2));
BFS(BV) = A(:, end);
OptimalValue = ZRow(end); 

disp('Optimal BFS = ')
disp(BFS(1:n))

disp('Optimal Value = ')
disp(OptimalValue)
  `);
}
