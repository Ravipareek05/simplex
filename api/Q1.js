export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(`
clc
clear all

C = [2 1 0];                
info = [1 2 1; 1 1 5; 1 -1 3]; 
b = [10; 6; 2];             
[m, n] = size(info);

s = eye(m);                 
A = [info s b];             
% Ensure Cost covers decision variables + slack variables
Cost = zeros(1, size(A,2)-1); 
Cost(1:n) = C;              
BV = n+1 : n+m;             

ZRow = Cost(BV) * A - [Cost 0]; 
Run = true;

while Run
    ZC = ZRow(1:end-1);     
    
    if any(ZC < 0)          
        [~, Pvt_Col] = min(ZC);
        
        sol = A(:, end);
        column = A(:, Pvt_Col);
        
        if all(column <= 0)
            error('The problem is Unbounded.');
        end
        
        ratio = inf * ones(m, 1);
        for i = 1 : m
            if column(i) > 0
                ratio(i) = sol(i) / column(i);
            end
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
        
        % Consistent ZRow update
        ZRow = ZRow - ZRow(Pvt_Col) * A(Pvt_Row, :);
        
    else
        Run = false;
        fprintf('Optimal Solution Reached.\\n');
    end
end

Final_BFS = zeros(1, size(A, 2) - 1);
Final_BFS(BV) = A(:, end);
OptimalValue = ZRow(end);

fprintf('\\nFinal Basic Feasible Solution:\\n');
disp(Final_BFS);
fprintf('Optimal Objective Value: %0.4f\\n', OptimalValue); 
  `);
}
